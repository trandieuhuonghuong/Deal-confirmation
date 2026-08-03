import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as XLSX from 'xlsx';
import {BookOpen, Database, FileText, Images, Printer, Upload, LockKeyhole, Download, Settings2, X, Search, Package, UserRound} from 'lucide-react';
import './styles.css';

const OUTPUT_SHEETS = ['成交确认书','成交确认书-附录'];
const CUSTOMER_SHEET = '客户基础数据';
const PRODUCT_SHEET = '产品订单（暂不含工业物料，待更新物料编码及装运信息）';
const SOURCE_SHEETS = ['客户基础数据','三品订单','越南文大写金额计算','付款条款参考',PRODUCT_SHEET,'客户地址信息汇总','客户地址筛选','付款条款汇总','付款条款筛选'];
const SHEET_LABELS = {'成交确认书':'Xác nhận giao dịch','成交确认书-附录':'Phụ lục xác nhận giao dịch','填写说明':'Hướng dẫn sử dụng'};

function rowsOf(ws){return ws?XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false}).map(r=>r.map(v=>String(v??'').trim())):[]}
function clean(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim()}
function findHeader(rows, aliases){
  for(let r=0;r<Math.min(rows.length,20);r++) for(let c=0;c<(rows[r]||[]).length;c++){
    const v=clean(rows[r][c]); if(aliases.some(a=>v.includes(clean(a)))) return {r,c};
  }
  return null;
}
function makeRecords(rows,type){
  if(!rows.length)return [];
  const aliases=type==='customer'?{
    code:['客户编码','mã khách hàng','customer code'],cn:['中文名称','tên tiếng trung'],vi:['越南名称','tên tiếng việt'],en:['英文名称','tên tiếng anh'],short:['简称','tên viết tắt'],address:['地址','địa chỉ'],tax:['税号','mã số thuế']
  }:{code:['物料编码','mã vật liệu','sku'],cn:['小类','中文名称','商品名称'],vi:['越南名称','commodities name(vn)','tên tiếng việt'],en:['英文名称','commodities name(en)','tên tiếng anh'],spec:['规格','quy cách'],unit:['单位','đơn vị']};
  const hits=Object.fromEntries(Object.entries(aliases).map(([k,a])=>[k,findHeader(rows,a)]));
  const headerRows=Object.values(hits).filter(Boolean).map(x=>x.r); const hr=headerRows.length?Math.max(...headerRows):0;
  const recs=[];
  for(let r=hr+1;r<rows.length;r++){
    const rec={_row:r}; Object.entries(hits).forEach(([k,h])=>rec[k]=h?rows[r]?.[h.c]||'':'');
    if(rec.code||rec.vi||rec.cn||rec.en) recs.push(rec);
  }
  return recs;
}
function setByLabel(ws, labels, value){
  if(!value)return ws; const next={...ws}; const range=XLSX.utils.decode_range(next['!ref']||'A1');
  outer: for(let r=range.s.r;r<=range.e.r;r++) for(let c=range.s.c;c<=range.e.c;c++){
    const a=XLSX.utils.encode_cell({r,c}); const txt=clean(next[a]?.v); if(labels.some(l=>txt.includes(clean(l)))){
      let target={r,c:c+1};
      // Skip merged label area when needed.
      const merge=(next['!merges']||[]).find(m=>r>=m.s.r&&r<=m.e.r&&c>=m.s.c&&c<=m.e.c);
      if(merge) target={r,c:merge.e.c+1};
      const t=XLSX.utils.encode_cell(target); next[t]={...(next[t]||{}),t:'s',v:value,w:value}; break outer;
    }
  }
  return next;
}

function App(){
  const [workbook,setWorkbook]=useState(null); const [active,setActive]=useState('成交确认书');
  const [role,setRole]=useState(localStorage.getItem('dc-role')||'admin'); const [notice,setNotice]=useState('Đang tải mẫu Excel...');
  const [imageSource,setImageSource]=useState(null); const [sourceOpen,setSourceOpen]=useState(false); const [sourceSheet,setSourceSheet]=useState(CUSTOMER_SHEET);
  const [customerKey,setCustomerKey]=useState(''); const [productKey,setProductKey]=useState('');
  useEffect(()=>{loadDefault();fetch('/du-lieu-tham-khao-anh-san-pham.json').then(r=>r.json()).then(setImageSource).catch(()=>{})},[]);
  useEffect(()=>localStorage.setItem('dc-role',role),[role]);
  async function loadDefault(){try{const r=await fetch('/mau-xac-nhan-giao-dich.xlsx');const b=await r.arrayBuffer();setWorkbook(XLSX.read(b,{type:'array',cellStyles:true}));setNotice('Đã tải mẫu Excel gốc.')}catch(e){setNotice('Không tải được mẫu Excel: '+e.message)}}
  function importFile(e){const f=e.target.files?.[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>{setWorkbook(XLSX.read(ev.target.result,{type:'array',cellStyles:true}));setNotice('Đã nhập '+f.name)};rd.readAsArrayBuffer(f)}
  function updateCell(sheetName,r,c,value){if(role==='viewer'||!workbook)return;const next={...workbook,Sheets:{...workbook.Sheets}};const ws={...next.Sheets[sheetName]};const a=XLSX.utils.encode_cell({r,c});ws[a]={...(ws[a]||{}),t:'s',v:value,w:value};next.Sheets[sheetName]=ws;setWorkbook(next)}
  function downloadExcel(){if(workbook)XLSX.writeFile(workbook,'xac-nhan-giao-dich-da-cap-nhat.xlsx')}
  const sheets=workbook?.SheetNames||[];
  const customers=useMemo(()=>makeRecords(rowsOf(workbook?.Sheets?.[CUSTOMER_SHEET]),'customer'),[workbook]);
  const products=useMemo(()=>makeRecords(rowsOf(workbook?.Sheets?.[PRODUCT_SHEET]),'product'),[workbook]);
  const currentRows=useMemo(()=>rowsOf(workbook?.Sheets?.[active]),[workbook,active]);
  function applyCustomer(key){setCustomerKey(key);const rec=customers.find(x=>String(x._row)===key);if(!rec||!workbook)return;let ws={...workbook.Sheets[active]};
    ws=setByLabel(ws,['客户编码','mã khách hàng','customer code'],rec.code);
    ws=setByLabel(ws,['客户名称','买方','tên khách hàng','buyer'],rec.vi||rec.en||rec.cn);
    ws=setByLabel(ws,['中文名称','tên tiếng trung'],rec.cn);
    ws=setByLabel(ws,['英文名称','tên tiếng anh'],rec.en);
    ws=setByLabel(ws,['简称','tên viết tắt'],rec.short);
    ws=setByLabel(ws,['地址','địa chỉ','address'],rec.address);
    ws=setByLabel(ws,['税号','mã số thuế','tax code'],rec.tax);
    setWorkbook({...workbook,Sheets:{...workbook.Sheets,[active]:ws}});setNotice('Đã điền thông tin khách hàng vào biểu mẫu.')
  }
  function applyProduct(key){setProductKey(key);const rec=products.find(x=>String(x._row)===key);if(!rec||!workbook)return;let ws={...workbook.Sheets[active]};
    ws=setByLabel(ws,['物料编码','mã vật liệu','sku'],rec.code);
    ws=setByLabel(ws,['商品名称','产品名称','tên sản phẩm','commodities name'],rec.en||rec.vi||rec.cn);
    ws=setByLabel(ws,['中文名称'],rec.cn);ws=setByLabel(ws,['越南名称','tên tiếng việt'],rec.vi);ws=setByLabel(ws,['英文名称','tên tiếng anh'],rec.en);
    ws=setByLabel(ws,['规格','quy cách'],rec.spec);ws=setByLabel(ws,['单位','đơn vị'],rec.unit);
    setWorkbook({...workbook,Sheets:{...workbook.Sheets,[active]:ws}});setNotice('Đã điền thông tin sản phẩm vào biểu mẫu.')
  }
  const nav=[...OUTPUT_SHEETS.filter(x=>sheets.includes(x)),'填写说明'];
  return <div className="app">
    <aside className="sidebar"><div className="brand"><div className="logo">海天</div><div><b>Haday Việt Nam</b><small>Xác nhận giao dịch</small></div></div>
      <nav>{nav.map(name=><button key={name} className={active===name?'active':''} onClick={()=>setActive(name)}>{name==='填写说明'?<BookOpen/>:<FileText/>}<span>{SHEET_LABELS[name]}</span></button>)}</nav>
      <button className="source-button" onClick={()=>setSourceOpen(true)}><Settings2/> Quản lý dữ liệu gốc</button>
      <div className="role"><label>Quyền người dùng</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="admin">Quản trị viên</option><option value="editor">Nhân viên nhập liệu</option><option value="viewer">Chỉ xem</option></select><p><LockKeyhole/> {role==='viewer'?'Không được chỉnh sửa dữ liệu gốc':'Được chỉnh sửa dữ liệu gốc'}</p></div>
    </aside>
    <main><header><div><h1>{SHEET_LABELS[active]}</h1><p>{notice}</p></div><div className="actions"><label className="btn secondary"><Upload/> Nhập Excel<input type="file" accept=".xlsx,.xls" hidden onChange={importFile}/></label><button className="btn secondary" onClick={downloadExcel}><Download/> Tải Excel</button>{OUTPUT_SHEETS.includes(active)&&<button className="btn primary" onClick={()=>window.print()}><Printer/> In / Lưu PDF</button>}</div></header>
      {active==='填写说明'?<Instructions imageSource={imageSource}/>:<>
        <div className="lookup-panel"><div className="lookup-title"><Search/> Chọn dữ liệu để điền vào biểu mẫu</div><div className="lookup-grid">
          <label><span><UserRound/> Khách hàng</span><select value={customerKey} onChange={e=>applyCustomer(e.target.value)}><option value="">— Chọn khách hàng —</option>{customers.map(x=><option key={x._row} value={x._row}>{[x.code,x.vi||x.en||x.cn].filter(Boolean).join(' · ')}</option>)}</select></label>
          <label><span><Package/> Sản phẩm</span><select value={productKey} onChange={e=>applyProduct(e.target.value)}><option value="">— Chọn sản phẩm —</option>{products.slice(0,5000).map(x=><option key={x._row} value={x._row}>{[x.code,x.vi||x.en||x.cn].filter(Boolean).join(' · ')}</option>)}</select></label>
        </div><p>Dữ liệu tham khảo không còn hiển thị thành tab riêng. Khi chọn, hệ thống tự điền vào các trường tương ứng trong bảng.</p></div>
        <div className="statusbar"><span className="locked">Bản thể hiện cuối cùng</span><span>{currentRows.length} dòng · {Math.max(0,...currentRows.map(r=>r.length))} cột</span></div><SheetGrid rows={currentRows}/>
      </>}
    </main>
    {sourceOpen&&<SourceModal workbook={workbook} role={role} sheet={sourceSheet} setSheet={setSourceSheet} close={()=>setSourceOpen(false)} updateCell={updateCell}/>} 
  </div>
}
function SheetGrid({rows}){if(!rows.length)return <div className="empty">Không có dữ liệu.</div>;const max=Math.min(Math.max(...rows.map(r=>r.length)),40);return <div className="sheet-wrap"><table className="sheet"><tbody>{rows.slice(0,350).map((row,r)=><tr key={r}>{Array.from({length:max}).map((_,c)=><td key={c} className={r<10?'top':''}>{row[c]||''}</td>)}</tr>)}</tbody></table></div>}
function SourceModal({workbook,role,sheet,setSheet,close,updateCell}){const rows=rowsOf(workbook?.Sheets?.[sheet]);const editable=role!=='viewer';const max=Math.min(Math.max(1,...rows.map(r=>r.length)),40);return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>Quản lý dữ liệu gốc</h2><p>Dữ liệu dùng cho các danh sách lựa chọn trên biểu mẫu.</p></div><button onClick={close}><X/></button></div><div className="source-tabs"><select value={sheet} onChange={e=>setSheet(e.target.value)}>{SOURCE_SHEETS.filter(s=>workbook?.SheetNames.includes(s)).map(s=><option key={s} value={s}>{s}</option>)}</select><span className={editable?'ok':'locked'}>{editable?'Có thể chỉnh sửa':'Chỉ xem'}</span></div><div className="modal-table"><table className="sheet"><tbody>{rows.slice(0,500).map((row,r)=><tr key={r}>{Array.from({length:max}).map((_,c)=><td key={c} contentEditable={editable} suppressContentEditableWarning onBlur={e=>updateCell(sheet,r,c,e.currentTarget.textContent)}>{row[c]||''}</td>)}</tr>)}</tbody></table></div></div></div>}
function Instructions({imageSource}){return <div className="instructions"><section><h2>1. Cách chọn dữ liệu</h2><p>Trên trang Xác nhận giao dịch, chọn khách hàng và sản phẩm trong khu vực <b>Chọn dữ liệu để điền vào biểu mẫu</b>. Hệ thống sẽ điền dữ liệu vào trường tương ứng, thay vì mở từng bảng dữ liệu thành tab riêng.</p></section><section><h2>2. Quản lý dữ liệu gốc</h2><p>Chọn <b>Quản lý dữ liệu gốc</b> ở menu bên trái. Quản trị viên và nhân viên nhập liệu được chỉnh sửa; người dùng chỉ xem không được sửa.</p></section><section><h2>3. Xuất bản</h2><p>Kiểm tra Xác nhận giao dịch và Phụ lục, sau đó chọn <b>In / Lưu PDF</b>. Dùng <b>Tải Excel</b> để lưu dữ liệu đã cập nhật.</p></section><section><h2>4. Ảnh sản phẩm</h2>{imageSource&&<a className="drive" href={imageSource.product_image_source?.folder_url} target="_blank" rel="noreferrer"><Images/> Mở thư mục ảnh sản phẩm</a>}</section></div>}
createRoot(document.getElementById('root')).render(<App/>);
