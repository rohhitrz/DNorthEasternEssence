"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ImageUpload({
	onChange,
	maxFiles = 5,
}: {
	onChange?: (files: File[]) => void;
	maxFiles?: number;
}) {
	const [files, setFiles] = useState<File[]>([]);

	const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

	return (
		<div className="space-y-3">
			<input
				type="file"
				multiple
				accept="image/jpeg,image/png,image/webp"
				onChange={(event) => {
					const next = Array.from(event.target.files || []).slice(0, maxFiles);
					setFiles(next);
					onChange?.(next);
				}}
			/>
			{previews.length > 0 ? (
				<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
					{previews.map((src, idx) => (
						<div key={idx} className="relative aspect-square overflow-hidden rounded-md border border-border">
							<Image src={src} alt={`Uploaded preview ${idx + 1}`} fill className="object-cover" sizes="200px" />
						</div>
					))}
				</div>
			) : null}
			{files.length > 0 ? (
				<Button type="button" variant="outline" onClick={() => setFiles([])}>
					Clear Selected Images
				</Button>
			) : null}
		</div>
	);
}
