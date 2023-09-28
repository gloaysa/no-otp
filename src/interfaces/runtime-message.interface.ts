export interface MessageModeSetting {
	setting: 'popup' | 'click';
}

export enum RuntimeMessageId {
	ModeSetting = 'MODE_SETTING',
}

export interface RuntimeMessage {
	id: RuntimeMessageId,
	payload: MessageModeSetting
}
