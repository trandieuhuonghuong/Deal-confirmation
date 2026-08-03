import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as XLSX from 'xlsx';
import {BookOpen, Database, FileText, Images, Printer, Save, Upload, LockKeyhole, Download} from 'lucide-react';
import './styles.css';

const SOURCE_SHEETS = ['客户基础数据','三品订单','越南文大写金额计算','付款条款参考','产品订单（暂不含工业物料，待更新物料编码及装运信息）','客户地址信息汇总','客户地址筛选','付款条款汇总','付款条款筛选'];
const OUTPUT_SHEETS = ['成交确认书','成交确认书-附录'];
const SHEET_LABELS = {
  '成交确认书':'Xác nhận giao dịch',
  '成交确认书-附录':'Phụ lục xác nhận giao dịch',
  '填写说明':'Hướng dẫn sử dụng',
  '客户基础数据':'Dữ liệu khách hàng',
  '三品订单':'Đơn hàng ba nhóm sản phẩm',
  '越南文大写金额计算':'Tính số tiền bằng chữ tiếng Việt',
  '付款条款参考':'Tham khảo điều khoản thanh toán',
  '产品订单（暂不含工业物料，待更新物料编码及装运信息）':'Dữ liệu gốc sản phẩm',
  '客户地址信息汇总':'Tổng hợp địa chỉ khách hàng',
  '客户地址筛选':'Lọc địa chỉ khách hàng',
  '付款条款汇总':'Tổng hợp điều khoản thanh toán',
  '付款条款筛选':'Lọc điều khoản thanh toán'
};

function normalizeSheet(sheet){
  return XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:false}).map(row=>row.map(v=>String(v??'')));
}
function App(){
  const [workbook,setWorkbook]=useState(null);
  const [active,setActive]=useState('成交确认书');
  const [role,setRole]=useState(localStorage.getItem('dc-role')||'admin');
  const [notice,setNotice]=useState('Đang tải mẫu Excel...');
  const [imageSource,setImageSource]=useState(null);

  useEffect(()=>{loadDefault(); fetch('/du-lieu-tham-khao-anh-san-pham.json').then(r=>r.json()).then(setImageSource).catch(()=>{});},[]);
  useEffect(()=>localStorage.setItem('dc-role',role),[role]);

  async function loadDefault(){
    try{const r=await fetch('/mau-xac-nhan-giao-dich.xlsx'); const b=await r.arrayBuffer(); setWorkbook(XLSX.read(b,{type:'array',cellStyles:true})); setNotice('Đã tải mẫu Excel gốc.');}
    catch(e){setNotice('Không tải được mẫu Excel: '+e.message)}
  }
  function importFile(e){
    const f=e.target.files?.[0]; if(!f)return;
    const reader=new FileReader(); reader.onload=ev=>{setWorkbook(XLSX.read(ev.target.result,{type:'array',cellStyles:true}));setNotice('Đã nhập '+f.name)}; reader.readAsArrayBuffer(f);
  }
  function updateCell(r,c,value){
    if(role==='viewer'||!workbook)return;
    const next={...workbook,Sheets:{...workbook.Sheets}};
    const ws={...next.Sheets[active]}; const addr=XLSX.utils.encode_cell({r,c}); ws[addr]={...(ws[addr]||{}),t:'s',v:value};
    const range=XLSX.utils.decode_range(ws['!ref']||'A1'); range.e.r=Math.max(range.e.r,r);range.e.c=Math.max(range.e.c,c);ws['!ref']=XLSX.utils.encode_range(range);
    next.Sheets[active]=ws; setWorkbook(next);
  }
  function downloadExcel(){
    if(!workbook)return; XLSX.writeFile(workbook,'xac-nhan-giao-dich-da-cap-nhat.xlsx');
  }
  const sheets=workbook?.SheetNames||[];
  const rows=useMemo(()=>workbook?.Sheets?.[active]?normalizeSheet(workbook.Sheets[active]):[],[workbook,active]);
  const isSource=SOURCE_SHEETS.includes(active);
  const editable=isSource && role!=='viewer';
  const nav=[...OUTPUT_SHEETS.filter(x=>sheets.includes(x)),...SOURCE_SHEETS.filter(x=>sheets.includes(x)),'填写说明'].filter(x=>x==='填写说明'||sheets.includes(x));

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="logo">海天</div><div><b>Haday Việt Nam</b><small>Xác nhận giao dịch</small></div></div>
      <nav>{nav.map(name=><button key={name} className={active===name?'active':''} onClick={()=>setActive(name)}>{OUTPUT_SHEETS.includes(name)?<FileText/>:name==='填写说明'?<BookOpen/>:<Database/>}<span>{SHEET_LABELS[name]||name}</span></button>)}</nav>
      <div className="role"><label>Quyền người dùng</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="admin">Quản trị viên</option><option value="editor">Nhân viên nhập liệu</option><option value="viewer">Chỉ xem</option></select><p><LockKeyhole/> {role==='viewer'?'Không được chỉnh sửa dữ liệu gốc':'Được chỉnh sửa dữ liệu gốc'}</p></div>
    </aside>
    <main>
      <header><div><h1>{SHEET_LABELS[active]||active}</h1><p>{notice}</p></div><div className="actions"><label className="btn secondary"><Upload/> Nhập Excel<input type="file" accept=".xlsx,.xls" hidden onChange={importFile}/></label><button className="btn secondary" onClick={downloadExcel}><Download/> Tải Excel</button>{OUTPUT_SHEETS.includes(active)&&<button className="btn primary" onClick={()=>window.print()}><Printer/> In / Lưu PDF</button>}</div></header>
      {active==='填写说明'?<Instructions imageSource={imageSource}/>:<>
        <div className="statusbar"><span className={editable?'ok':'locked'}>{editable?'Có thể chỉnh sửa dữ liệu gốc':'Bản thể hiện / chỉ đọc'}</span><span>{rows.length} dòng · {Math.max(0,...rows.map(r=>r.length))} cột</span></div>
        <SheetGrid rows={rows} editable={editable} updateCell={updateCell}/>
      </>}
    </main>
  </div>
}
function SheetGrid({rows,editable,updateCell}){
  if(!rows.length)return <div className="empty">Không có dữ liệu trong trang tính này.</div>;
  const maxCols=Math.min(Math.max(...rows.map(r=>r.length)),30);
  const display=rows.slice(0,300);
  return <div className="sheet-wrap"><table className="sheet"><tbody>{display.map((row,r)=><tr key={r}>{Array.from({length:maxCols}).map((_,c)=><td key={c} className={(r<10?'top ':'')+(row[c]?'filled':'')} contentEditable={editable} suppressContentEditableWarning onBlur={e=>updateCell(r,c,e.currentTarget.textContent)}>{row[c]||''}</td>)}</tr>)}</tbody></table>{rows.length>300&&<p className="limit">Đang hiển thị 300 dòng đầu để bảo đảm tốc độ. File Excel tải xuống vẫn giữ toàn bộ dữ liệu.</p>}</div>
}
function Instructions({imageSource}){return <div className="instructions">
  <section><h2>1. Cấu trúc hệ thống</h2><p><b>Dữ liệu gốc</b> là nơi nhập và quản lý khách hàng, sản phẩm, mã vật liệu, điều khoản thanh toán, địa chỉ và thông tin đơn hàng. Dữ liệu này được dùng để tạo hai bản thể hiện cuối cùng: <b>Xác nhận giao dịch</b> và <b>Phụ lục xác nhận giao dịch</b>.</p></section>
  <section><h2>2. Quyền hạn người dùng</h2><div className="cards"><article><b>Quản trị viên</b><p>Được nhập, sửa, xóa dữ liệu gốc; nhập file Excel và tải file đã cập nhật.</p></article><article><b>Nhân viên nhập liệu</b><p>Được điều chỉnh dữ liệu gốc phục vụ đơn hàng, nhưng không thay đổi cấu hình hệ thống.</p></article><article><b>Chỉ xem</b><p>Chỉ xem các bảng và in PDF; không thể sửa dữ liệu.</p></article></div></section>
  <section><h2>3. Quy trình sử dụng</h2><ol><li>Chọn đúng quyền người dùng.</li><li>Mở nhóm Dữ liệu gốc và cập nhật thông tin cần thiết.</li><li>Kiểm tra trang Xác nhận giao dịch và Phụ lục.</li><li>Chọn <b>In / Lưu PDF</b>, sau đó chọn máy in “Save as PDF”.</li><li>Chọn <b>Tải Excel</b> để lưu lại bản dữ liệu đã cập nhật.</li></ol></section>
  <section><h2>4. Quy tắc dữ liệu từ mẫu</h2><ul><li>Số đơn hàng phải thống nhất với mã đơn hàng trên hệ thống thương mại.</li><li>Ngày đơn hàng phải trùng thời gian ký hợp đồng.</li><li>Phải chọn phương thức vận chuyển, điều khoản thương mại và cảng đến.</li><li>Thứ tự và số thùng được tạo theo công thức trong mẫu; không sửa thủ công khi không cần thiết.</li></ul></section>
  <section><h2>5. Ảnh sản phẩm tham khảo</h2><p>Thư mục ảnh Google Drive đã được lưu làm nguồn tham khảo. Khi xây dựng cơ sở dữ liệu chính thức, ảnh nên được liên kết theo <b>mã vật liệu/SKU</b>.</p>{imageSource&&<a className="drive" href={imageSource.product_image_source?.folder_url} target="_blank" rel="noreferrer"><Images/> Mở thư mục ảnh sản phẩm</a>}</section>
  <section><h2>6. Lưu ý về dữ liệu</h2><p>Phiên bản này chạy trực tiếp trên trình duyệt. Dữ liệu chỉnh sửa chỉ nằm trong phiên làm việc cho đến khi bạn tải Excel xuống. Khi kết nối Supabase, hệ thống có thể lưu lịch sử, tài khoản, phân quyền và đồng bộ nhiều thiết bị.</p></section>
</div>}
createRoot(document.getElementById('root')).render(<App/>);
