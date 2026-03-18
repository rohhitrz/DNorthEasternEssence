"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductFilters({
	category,
	onCategoryChange,
	sort,
	onSortChange,
}: {
	category: string;
	onCategoryChange: (value: string) => void;
	sort: string;
	onSortChange: (value: string) => void;
}) {
	const handleCategoryChange = (value: string | null) => {
		if (value) {
			onCategoryChange(value);
		}
	};

	const handleSortChange = (value: string | null) => {
		if (value) {
			onSortChange(value);
		}
	};

	return (
		<div className="flex flex-wrap gap-3">
			<Select value={category} onValueChange={handleCategoryChange}>
				<SelectTrigger>
					<SelectValue placeholder="Category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Categories</SelectItem>
					<SelectItem value="BAKHOOR">Deodorants</SelectItem>
					<SelectItem value="OUD_OIL">Attar</SelectItem>
					<SelectItem value="PERFUME_BLEND">Perfume</SelectItem>
				</SelectContent>
			</Select>

			<Select value={sort} onValueChange={handleSortChange}>
				<SelectTrigger>
					<SelectValue placeholder="Sort" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="newest">Newest</SelectItem>
					<SelectItem value="price-asc">Price: Low to High</SelectItem>
					<SelectItem value="price-desc">Price: High to Low</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
