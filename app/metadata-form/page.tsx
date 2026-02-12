import TokenMetadataForm from "@/components/ui/form";

function Page() {
  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <h1 className="text-5xl" style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "45px",
          fontWeight: 400,
          letterSpacing: "4px"
        }}>Launch Your Token</h1>
        <TokenMetadataForm/>
    </div>
  )
}

export default Page