export interface IHeader {
	propName: string;
	text: string;
	sort: 'none' | 'asc' | 'desc';
	isSortable: boolean;
	isEnabled: boolean;
	isHtml: boolean;
	isSum?: boolean;
	converter?: IConverter;
}

export interface IConverter {
	to(v: unknown): unknown;
}
