/**
 * The components for shadow dom and dynamic import
 */
export const ExportComponents: Record<string, ExportComponent> = {
	'edit/Upload': {
		styles: [
			'@/icon_font.css',
			'@/assets/css/vidstack/theme.css',
			'@/assets/css/vidstack/layouts/audio.css',
			'@/assets/css/vidstack/layouts/video.css',
			'/components/edit/Upload/index.less',
			'/components/edit/Upload/components/Loader.less',
			'/components/edit/Upload/components/Audio.less',
			'/components/edit/Upload/components/Image.less',
			'/components/edit/Upload/components/Video.less'
		]
	}
}

export interface ExportComponent {
	styles: string[]
}
