import { Input } from "../input"
import { Label } from "../label"
import { Quote } from "./quote"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCreatePool } from "@/hooks/createPool";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import { Field, FieldGroup, FieldLabel, FieldError } from "../field";

const formSchema = z.object({
  mintAAmount: z
    .number(),
  mintBAmount: z
    .number(),
});

function PoolForm(props: { id: string, mintName: string, mintAddress: PublicKey, mintDecimal: number }) {

    const { createPool } = useCreatePool();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mintAAmount: 100,
            mintBAmount: 100
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const result = await createPool(props.mintAddress, publicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), data.mintAAmount, data.mintBAmount, props.mintDecimal);
            if (result) {
                toast.success(result.txId);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
            return;
        }
    }
        
  return (
    <form id={props.id} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
            <Label>Base Token</Label>
            <Input type="text" aria-label="base-token" value={props.mintName} disabled className="text-white"/>
            <Label>Quote Token</Label>
            <Quote />
            <Controller 
                name="mintAAmount"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="base-token-amount" className="label">
                            Base Token Amount*
                        </FieldLabel>
                        <Input
                            {...field}
                            id="base-token-amount"
                            aria-invalid={fieldState.invalid}
                            placeholder="100"
                            autoComplete="off"
                            className="input-box"
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            >    
            </Controller>
            <Controller 
                name="mintBAmount"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="quote-token-amount" className="label">
                            Quote Token Amount*
                        </FieldLabel>
                        <Input
                            {...field}
                            id="quote-token-amount"
                            aria-invalid={fieldState.invalid}
                            placeholder="100"
                            autoComplete="off"
                            className="input-box"
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            >    
            </Controller>
        </FieldGroup>
    </form>
  )
}

export default PoolForm