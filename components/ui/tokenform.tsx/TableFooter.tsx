import { Copyright } from "lucide-react"

function TableFooter() {
  return (
    <div className="flex gap-2 p-2 justify-center items-center text-xs bg-linear-to-r from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent">
        <span><Copyright className="text-teal-400" size={15}/></span> 
        <span>{"COPYRIGHT 2026"}</span>
    </div>
  )
}

export default TableFooter