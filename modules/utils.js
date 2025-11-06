// 工具函数模块

// 简写函数
export const el = (id) => document.getElementById(id);

// 获取简繁优先级
export function getSimpDefault(){
  const v = document.querySelector('input[name="simp"]:checked')?.value;
  return v === 'simp' ? 1 : 0;
}

// 获取候选词标签
export function getSelectLabels(){
  const customLabels = el('customLabels');
  const pageSize = el('pageSize');
  
  const labelType = document.querySelector('input[name="selectLabels"]:checked')?.value;
  if(labelType === 'custom' && customLabels && customLabels.value.trim()){
    return customLabels.value.trim().split(/\s+/).filter(Boolean);
  }
  const size = parseInt(pageSize?.value) || 9;
  return Array.from({length: size}, (_, i) => String(i + 1));
}

// 下载文件
export function download(text, filename){
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
