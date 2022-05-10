import { ConfigProvider, message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { genConfig } from 'react-nice-avatar'
import store from 'store2'
import { singleton } from 'tsyringe'

import { Stack } from '@/models'
import Service from '@/services/app'

import type { AvatarFullConfig } from 'react-nice-avatar'

import type { App, LocaleMessages } from '@/types'

@singleton()
export default class GlobalModel {
	theme: App.Theme = 'light'
	avatar = {} as AvatarFullConfig
	locale_messages = {} as LocaleMessages
	app_info = {} as App.Info
	user = (store.get('user') || {}) as App.User
	menu = (store.get('menu') || []) as Array<App.Menu>
	current_nav: number = store.get('current_nav') || 0
	current_menu: number = store.get('current_menu') || 0
	visible_nav: boolean = true
	visible_menu: boolean = true
	visible_header: boolean = true
	loading: boolean = false

	constructor(private service: Service, public stack: Stack) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (store.get('xgen-theme') || 'light') as App.Theme
		const avatar = store.get('avatar') as AvatarFullConfig

		this.getAppInfo()
		this.setTheme(theme)
		this.setAvatar(avatar)
	}

	async getAppInfo() {
		const { res, err } = await this.service.getAppInfo<App.Info>()

		if (err) return

		store.set('__mode', res.mode)

		this.app_info = res
	}

	async getUserMenu() {
		const { res, err } = await this.service.getUserMenu<Array<App.Menu>>()

		if (err) return

		this.menu = res

		store.set('menu', res)

		message.success(this.locale_messages.layout.setting.update_menu.feedback)
	}

	setAvatar(avatar?: AvatarFullConfig) {
		this.avatar = avatar || genConfig()

		store.set('avatar', this.avatar)
	}

	setTheme(theme: App.Theme) {
		this.theme = theme

		store.set('xgen-theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
				primaryColor: theme === 'light' ? '#3371fc' : '#6a96f9'
			}
		})
	}

	toggleMenu() {
		this.visible_menu = !this.visible_menu
      }
}
