import jsSHA from 'jssha'

export default class TOTP {
	public key: string
	public user: string

	private error_mess: string
	private otp: number
	private countDown: number
	private log: boolean
	private countDownCallback: Function | null
	private updateCallback: Function | null

	private readonly interval: NodeJS.Timeout

	constructor(key, user = 'user@example.com') {
		this.key = key
		this.error_mess = ''
		this.otp = 0
		this.countDown = 0
		this.log = false
		this.countDownCallback = null
		this.updateCallback = null
		this.user = user

		this.update()

		this.interval = setInterval(() => {
			const epoch = Math.round(new Date().getTime() / 1000.0)
			this.countDown = 30 - (epoch % 30)
			if (epoch % 30 === 0) this.update()
			if (this.log) console.log('Update OTP in ' + this.countDown + ' seconds...')
			if (typeof this.countDownCallback === 'function') {
				this.countDownCallback(this)
			}
		}, 1000)
	}

	setUpdateCallback(callback) {
		this.updateCallback = callback
		this.update()
	}

	setCountDownCallback(callback) {
		this.countDownCallback = callback
	}

	dec2hex(s) {
		return (s < 15.5 ? '0' : '') + Math.round(s).toString(16)
	}

	hex2dec(s) {
		return parseInt(s, 16)
	}

	leftpad(str, len, pad) {
		if (len + 1 >= str.length) {
			str = Array(len + 1 - str.length).join(pad) + str
		}
		return str
	}

	base32tohex(base32) {
		let i
		let base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
		let bits = ''
		let hex = ''
		for (i = 0; i < base32.length; i++) {
			const val = base32chars.indexOf(base32.charAt(i).toUpperCase())
			bits += this.leftpad(val.toString(2), 5, '0')
		}
		for (i = 0; i + 4 <= bits.length; i += 4) {
			const chunk = bits.substr(i, 4)
			hex = hex + parseInt(chunk, 2).toString(16)
		}
		return hex
	}

	update() {
		const key = this.base32tohex(this.key)
		const epoch = Math.round(new Date().getTime() / 1000.0)
		const time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, '0')

		const shaObj = new jsSHA('SHA-1', 'HEX')
		shaObj.setHMACKey(key, 'HEX')
		shaObj.update(time)
		const hmac = shaObj.getHMAC('HEX')

		let offset = 0

		if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
			this.error_mess = hmac
			return false
		} else {
			offset = this.hex2dec(hmac.substring(hmac.length - 1))
		}

		let otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + ''
		otp = otp.substr(otp.length - 6, 6)
		this.otp = parseInt(otp)
		if (this.log) console.log('New OTP: ' + this.otp)
		if (typeof this.updateCallback === 'function') {
			this.updateCallback(this)
		}
		return true
	}

	getOTP() {
		return this.otp
	}

	getCountDown() {
		return this.countDown
	}

	setKey(k) {
		this.key = k
		return true
	}

	setUser(u) {
		this.user = u
		return true
	}

	setLog(bool) {
		this.log = bool
		return true
	}

	stop() {
		clearInterval(this.interval)
		return true
	}
}
