import { Copyright } from "lucide-react"

function TableFooter() {
  return (
    <div className="flex gap-2 p-2 justify-center items-center text-xs">
        <span><Copyright size={15}/></span> 
        <span>{"COPYRIGHT 2026"}</span>
    </div>
  )
}

export default TableFooter