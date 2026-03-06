
function TableHeader() {
  return (
    <div className="grid grid-cols-5 bg-linear-to-r pr-3 pl-5 from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent">
        <span className="flex justify-start">{"ASSET"}</span>
        <span className="flex justify-end">{"BALANCE"}</span>
        <span className="flex justify-end">{"PRICE"}</span>
        <span className="flex justify-end">{"VALUE"}</span>
        <span className="flex justify-end">{"24H"}</span>
    </div>
  )
}

export default TableHeader