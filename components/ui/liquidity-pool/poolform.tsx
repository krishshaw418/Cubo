import { Input } from "../input"
import { Quote } from "./quote"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCreatePool } from "@/hooks/createPool";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import { Field, FieldGroup, FieldLabel, FieldError } from "../field";
import { useEffect } from "react";

const formSchema = z.object({
  mintA: z.string(),
  mintB: z.string(),
  mintAAmount: z
    .number(),
  mintBAmount: z
    .number(),
});

function PoolForm(props: { id: string, mintName: string, mintAddress: PublicKey, mintDecimal: number }) {

    const { createPool } = useCreatePool();
    useEffect(() => {
        form.setValue("mintA", props.mintName, { shouldValidate: true })
    }, [props.mintName])
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mintB: "USDC",
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
            <Controller
                name="mintA"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="base-token-name" className="label">Base Token</FieldLabel>
                        <Input {...field} aria-invalid={fieldState.invalid} id="base-token-name" type="text" aria-label="base-token" value={props.mintName} disabled className="text-white" />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="mintB"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel htmlFor="quote-token-name" className="label">Quote Token</FieldLabel>
                        <Quote id="quote-token-name"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            aria-invalid={fieldState.invalid}
                         />
                    </Field>
                )}
            />  
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
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />    
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
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />    
        </FieldGroup>
    </form>
  )
}

export default PoolForm