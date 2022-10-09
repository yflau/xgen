import type { App } from '@/types'

const Index = (
	arr: Array<App.Menu>,
	url: string,
	parent_index?: number
): { nav: number; menu: number; hit: boolean; menu_item: App.Menu } => {
	const target = { nav: 0, menu: 0, hit: false, menu_item: {} as App.Menu }

	arr.map((item, index) => {
		if (item.path === url) {
			if (parent_index !== undefined) {
				target.nav = parent_index || 0
				target.menu = index || 0
			} else {
				target.nav = index
			}

			target.hit = true
			target.menu_item = item
		} else {
			if (item.children && item.children.length) {
				const { nav, menu, hit, menu_item } = Index(item.children, url, index)

				if (hit) {
					target.nav = nav
					target.menu = menu
					target.hit = hit
					target.menu_item = menu_item
				}
			}
		}
	})

	return target
}

export default Index
