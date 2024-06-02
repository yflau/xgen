import { Icon } from '@/widgets'
import { GetPresets, IconName, IconSize } from '../../utils'
import { useBuilderContext } from '../Builder/Provider'
import { useEffect, useState } from 'react'
import { Empty, Segmented, Skeleton, Spin, message } from 'antd'

import styles from './index.less'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import { useGlobal } from '@/context/app'
import { PresetItem } from '../../types'
import { LoadingOutlined } from '@ant-design/icons'

interface IProps {
	keywords?: string
}

const Index = (props: IProps) => {
	const global = useGlobal()
	const { is_cn, presets } = useBuilderContext()
	const [presetsData, setPresetsData] = useState<PresetItem[]>([])
	const [categories, setCategories] = useState<any>([])
	const [category, setCategory] = useState<string | number | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(false)
	const [loadingData, setLoadingData] = useState<boolean>(false)
	const [refetch, setRefetch] = useState<boolean>(false)

	const onChange = (value: string | number) => {
		setCategory(value)
		setRefetch(true)
	}

	const fetchData = (withCategories: boolean = false) => {
		if (presets === undefined) return
		if (global.loading) return
		if (loading) return
		if (loadingData) return

		withCategories && setLoading(true)
		setLoadingData(true)
		GetPresets(presets, { withCategories: withCategories, category, keywords: props.keywords })
			.then((res) => {
				if (!res) return
				if (Array.isArray(res)) {
					setPresetsData(res)
					return
				}

				const { categories, presets } = res
				setCategories(categories)
				setPresetsData(presets)
				if (categories.length > 0 && categories[0].value !== undefined) {
					setCategory(categories[0].value)
				}
			})
			.catch((err) => {
				console.error('[FlowBuilder] GetPresets Error ', err)
				message.error(is_cn ? '获取预设数据失败' : 'Failed to get preset data')
				setLoading(false)
			})
			.finally(() => {
				setLoading(false)
				setLoadingData(false)
			})
	}

	useEffect(() => fetchData(true), [presets]) // Initial fetch
	useEffect(() => {
		if (props.keywords && props.keywords !== '') {
			fetchData()
			return
		}
		refetch && fetchData()
	}, [category, props.keywords]) // Fetch data

	return (
		<div className={clsx([styles._local])}>
			<If condition={loading}>
				<Then>
					<div className='p_16'>
						<Skeleton active round />
					</div>
				</Then>
				<Else>
					<If condition={categories.length > 0}>
						<Then>
							<div className='categories'>
								<Segmented options={categories} value={category} onChange={onChange} />
							</div>
						</Then>
					</If>
					<If condition={loadingData}>
						<Then>
							<div className='flex items_center justify_center p_16'>
								<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
							</div>
						</Then>
						<Else>
							<If condition={presetsData.length == 0}>
								<Then>
									<Empty
										className='empty'
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={
											is_cn ? '未找到预设数据' : 'No preset data found'
										}
									/>
								</Then>
								<Else>
									<div className='items mt_16 pl_8 pr_8'>
										{presetsData?.map((item, index) => (
											<div
												key={index}
												className='item'
												draggable
												unselectable='on'
												onDragStart={(e) =>
													e.dataTransfer.setData(
														'application/reactflow',
														'AI-Data'
													)
												}
											>
												Preset Item
											</div>
										))}
									</div>
								</Else>
							</If>
						</Else>
					</If>
				</Else>
			</If>
		</div>
	)
}

export default window.$app.memo(Index)