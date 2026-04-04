"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import "./TokenCreateForm.css";
import { useDropzone } from "react-dropzone";
import useUmi from "@/hooks/useUmi";
import { createGenericFile } from "@metaplex-foundation/umi";
import { toast } from "sonner";
import { useCreateToken } from "@/hooks/createToken";
import { useMintToken } from "@/hooks/mintToken";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Progress } from "../progress";

// image file type validation
const imageSchema = z
  .instanceof(File)
  .refine(
    (file) => ["image/png", "image/jpeg", "image/gif"].includes(file.type),
    { message: "Invalid image type" }
  )

// form field validationwa
const formSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters required")
    .max(32, "Upto 32 characters allowed"),
  symbol: z
    .string()
    .min(1, "Minimum 1 character required")
    .max(8, "Upto 8 characters allowed"),
  decimals: z
    .number()
    .min(1, "Minimum 1 decimal required")
    .max(9, "Upto 9 decimals allowed"),
  supply: z
    .number()
    .min(1, "Minimum 1 token required")
    .max(1000000000, "Upto 1B allowed at a time"),
  description: z
    .string()
    .min(20, "Minimum 20 characters required")
    .max(500, "Maximum 500 characters allowed"),
  image: imageSchema,
});

function TokenMetadataForm(props: { id: string, isLaunching: boolean, setIsLaunching: React.Dispatch<React.SetStateAction<boolean>> }) {
    // react-dropzone for image
    const { acceptedFiles, getInputProps, getRootProps } = useDropzone({
        maxFiles: 1, // number of files allowed
        accept: { 'image/png': [], 'image/jpeg': [], 'image/gif': [] }, // file type
        preventDropOnDocument: true,
        // onDrop function to update the form's image field on image drop
        onDrop: (acceptedFiles) => {
            form.setValue("image", acceptedFiles[0] ?? null, {
                shouldValidate: true,
            });
        },
    });

    // react-form hook
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            symbol: "",
            decimals: 6,
            supply: 1,
            description: "",
        },
    });

    // hook calls
    const { umi } = useUmi();
    const { createToken } = useCreateToken();
    const { mintTokens } = useMintToken();
    const { publicKey } = useWallet();
    const [progress, setProgress] = useState(0);
    // const [isLaunching, setIsLaunching] = useState(false);
  
    async function onSubmit(data: z.infer<typeof formSchema>) {

        props.setIsLaunching(true);

        if (!publicKey) {
            toast.error("Wallet not connected!");
            return;
        }

        let image = null;
        // transforming image file object into buffer
        const imgArray = await data.image?.arrayBuffer();
        const fileName = data.image?.name;

        if (imgArray && fileName) {
            const imgUint8Array = new Uint8Array(imgArray);
            image = createGenericFile(imgUint8Array, fileName, {
                contentType: data.image?.type,
            });
        }

        if (image) {
            try {
                // Image file upload to ipfs
                const [imgURI] = await umi.uploader.upload([image]);
                console.log(imgURI);
            
                if (!imgURI) {
                    throw new Error("Failed to upload token image");
                }

                setProgress(25);
                toast.success("Image uploaded successfully!");

                // Preparing metadata json
                const metadata = {
                    name: data.name,
                    description: data.description,
                    image: imgURI,
                    symbol: data.symbol,
                };

                // meta_data.json file upload on ipfs
                const metaDataJsonURI = await umi.uploader.uploadJson(metadata);

                if (!metaDataJsonURI) {
                    throw new Error("Failed to upload metadata!");
                }

                setProgress(50);
                toast.success("Metadata uploaded successfully!");

                // initializing mint account and metadata account
                const result = await createToken(data.name, metaDataJsonURI, data.symbol, data.decimals);

                if (!result) {
                    throw new Error("Failed to initialize mint and metadata account!");
                }

                setProgress(75);
                toast.success("Mint account initialized successfully!");
                // minting tokens
                const mintSignature = await mintTokens(
                    result.mint, // mint address
                    data.supply, // initial supply of the new token
                );

                if (!mintSignature) {
                    throw new Error("Failed to mint new tokens!");
                }

                setProgress(100);
                toast.success("Tokens minted successfully!");

            } catch (error: any) {
                toast.error(error.message);
                props.setIsLaunching(false);
                setProgress(0);
            }
        }
    }

    useEffect(() => {
        console.log("From useEffect: ", props.isLaunching);
        if (progress === 100) {
            props.setIsLaunching(false);
            setProgress(0);
        }
    }, [progress]);

    const label = new Map([
        [0, "Uploading image..."],
        [25, "Uploading metadata..."],
        [50, "Initializing mint..."],
        [75, "Minting new tokens..."]
    ])

    return (
        <Card className="border-0 bg-transparent text-white">
            <CardContent>
                {props.isLaunching && (
                    <div>
                        <Field>
                            <FieldLabel className="label">{label.get(progress)}</FieldLabel>
                            <Progress value={progress} className="w-[50%] mb-4 bg-gray-800" />
                        </Field>
                    </div>
                )}
                {!props.isLaunching && (
                    <form id={props.id} onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="token-name" className="label">
                                        Name*
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
                                        <FieldError errors={[fieldState.error]} />
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
                                        Symbol*
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
                                        <FieldError errors={[fieldState.error]} />
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
                                        Decimals*
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
                                        min={1}
                                        max={9}
                                    />
                                    <FieldDescription>
                                        Most tokens use 6 decimals.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                            className="text-red-500"
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="supply"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="token-initial-supply" className="label">
                                        Supply*
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
                                        min={1}
                                        max={1000000000}
                                    />
                                    <FieldDescription>Most token use 10B</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="image"
                            control={form.control}
                            render={({ fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="token-image" className="label">
                                        Image*
                                    </FieldLabel>
                                    <div
                                        {...getRootProps()}
                                        className={`input-box p-4 rounded-lg border-2 border-dashed text-center cursor-pointer ${fieldState.invalid ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        {/* getInputProps handles type, accept, onChange internally */}
                                        <Input {...getInputProps()} id="token-image" />
                                        <p className="text-sm text-[#606060]">
                                            Drag &apos;n&apos; drop token image here, or click to select files.
                                            Required types are .png, .jpg, .gif
                                        </p>
                                    </div>
                                    <aside>
                                        {acceptedFiles.length > 0 && (
                                            <ul>
                                                {acceptedFiles.map((file) => (
                                                    <li key={file.name} className="text-sm">
                                                        {file.name} - {Math.ceil(file.size/1000000)} Mb
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </aside>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="token-description" className="label">
                                        Description*
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
                )}
            </CardContent>
        </Card>
    );
}

export default TokenMetadataForm;