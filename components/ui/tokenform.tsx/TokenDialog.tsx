import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../dialog"
import { Button } from "../button"
import TokenMetadataForm from "./TokenCreateForm"
import { useState } from "react";

function TokenDialog() {
    
    const [isLaunching, setIsLaunching] = useState(false);

  return (
      <div className="flex justify-end px-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-50 button hover:cursor-pointer"
              style={{
                width: "215px",
              }}
            >
              Create Token
            </Button>
          </DialogTrigger>

          <DialogContent
            aria-describedby="form-content"
            className="w-full border-0"
            style={{
              fontFamily: "Orbitron, sans-serif",
              boxShadow: "0 0 10px #00FFFF, 0 0 10px #14F195",
            }}
          >
            <DialogHeader className="flex items-center">
              <DialogTitle className="bg-linear-to-tr from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent font-light text-2xl">
                Launch your token
              </DialogTitle>
            </DialogHeader>

            {/* Token form component */}
            <div className="no-scrollbar -mx-4 max-h-[67vh] overflow-y-auto px-4">
              <TokenMetadataForm id="token-metadata-form" isLaunching={isLaunching} setIsLaunching={setIsLaunching}/>
            </div>

            <DialogDescription className="sr-only"></DialogDescription>

            <DialogFooter>
              {!isLaunching && (
                <Button
                  type="submit"
                  variant="ghost"
                  form="token-metadata-form"
                  className="button"
                >
                  Launch
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default TokenDialog