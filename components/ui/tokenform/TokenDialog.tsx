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
              className="w-50 bg-transparent hover:cursor-pointer"
              style={{
                width: "215px",
                borderRadius: '10px',
                boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
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
              <DialogTitle className="font-light text-2xl">
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
                  form="token-metadata-form"
                  className="w-50 bg-transparent hover:cursor-pointer"
                  style={{
                    width: "215px",
                    borderRadius: '10px',
                    boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
                  }}
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