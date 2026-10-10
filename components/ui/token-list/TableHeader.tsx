function TableHeader() {
  return (
    <div className="grid grid-cols-[minmax(16rem,2fr)_repeat(4,minmax(7rem,1fr))] items-center gap-2 px-3 pb-2 pt-5 text-white">
      <span className="text-left">ASSET</span>
      <span className="text-right">BALANCE</span>
      <span className="text-right">PRICE</span>
      <span className="text-right">VALUE</span>
      <span className="text-right">24H</span>
    </div>
  );
}

export default TableHeader;
