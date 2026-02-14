"use client"
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import "./TokenCreateForm.css";

const formSchema = z.object({
    name: z.string().min(3, "Minimum 3 characters required").max(32, "Upto 32 characters allowed"),
    symbol: z.string().min(1, "Minimum 1 character required").max(8, "Upto 8 characters allowed"),
    decimals: z.number().min(1, "Minimum 1 decimal required").max(9, "Upto 9 decimals allowed"),
    supply: z.number().min(1, "Minimum 1 token required").max(1000000000, "Upto 1B allowed at a time"),
    description: z.string().min(20, "Minimum 20 characters required").max(500, "Maximum 500 characters allowed"),
    image: z.string().url("Invalid url")
})

function TokenMetadataForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            symbol: "",
            decimals: 6,
            supply: 1,
            description: "",
            image: ""
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }
  return (
      <Card className="border-0 bg-transparent text-white">
        <CardContent>
            <form id="token-metadata-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-name" className="label">
                                    Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="token-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ex: Solana"
                                    autoComplete="off"
                                    className="input-box"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="symbol"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-symbol" className="label">
                                    Symbol
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="token-symbol"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ex: SOL"
                                    autoComplete="off"
                                    className="input-box"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="decimals"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-decimals" className="label">
                                    Decimals
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="token-decimals"
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="6"
                                    autoComplete="off"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    className="input-box"
                                />
                                <FieldDescription>
                                    Most tokens use 6 decimals.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} className="text-red-500"/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="supply"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-initial-supply" className="label">
                                    Supply
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="token-initial-supply"
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="1"
                                    autoComplete="off"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    className="input-box"
                                />
                                <FieldDescription>
                                    Most token use 10B
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="image"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-image" className="label">
                                    Image URL
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="token-image"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="https://example.com/token-image.png"
                                    autoComplete="off"
                                    className="input-box"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="description"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="token-description" className="label">
                                    Description
                                </FieldLabel>
                                <InputGroup className="input-box">
                                    <InputGroupTextarea
                                        {...field}
                                        id="token-description"
                                        placeholder="Ex: The first community token on Solana..."
                                        autoComplete="off"
                                        rows={6}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText className="tabular-nums text-xs">
                                            {field.value.length}/500 characters
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button type="submit" form="token-metadata-form" style={{
                fontFamily: 'Orbitron, sans-serif',
                backgroundImage: 'linear-gradient(135deg, #21e47f 0%, #68c4f6 100%)',
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                borderRadius: '10px',
                // width: '100%',
                boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
                letterSpacing: "3px"
            }}>Create Token</Button>
        </CardFooter>
    </Card>
  )
}

export default TokenMetadataForm;