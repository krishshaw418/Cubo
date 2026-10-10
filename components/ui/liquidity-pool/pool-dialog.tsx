import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../dialog";
import { Button } from "../button";
import { PublicKey } from "@metaplex-foundation/umi";
import PoolForm from "./poolform";

function PoolDialog(props: {
  mintName: string;
  mintAddress: PublicKey;
  mintDecimal: number;
}) {
  return (
    <div>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full whitespace-nowrap bg-transparent sm:w-auto"
            style={{
              borderRadius: "10px",
              boxShadow: "0 0 4px #00FFFF, 0 0 4px #14F195",
            }}
          >
            Create Liquidity Pool
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto"
          style={{
            fontFamily: "Orbitron, sans-serif",
            boxShadow: "0 0 10px #00FFFF, 0 0 10px #14F195",
            border: 0,
          }}
        >
          <DialogHeader className="flex items-center">
            <DialogTitle className="font-light text-2xl">
              Initialize CPMM Pool
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only"></DialogDescription>
          <PoolForm
            id="lp-form"
            mintName={props.mintName}
            mintAddress={props.mintAddress}
            mintDecimal={props.mintDecimal}
          />
          <DialogFooter>
            <Button
              type="submit"
              form="lp-form"
              className="w-50 bg-transparent hover:cursor-pointer"
              style={{
                width: "215px",
                borderRadius: "10px",
                boxShadow: "0 0 4px #00FFFF, 0 0 4px #14F195",
              }}
            >
              Initialize Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PoolDialog;
