declare var Util: {
	LoadScript: (src: string, callBack: () => void) => void,
	URLtoObject: () => any,
	Polyfill: () => void,
	DateFormat: (date: Date) => string,
	Download: (fileName: string, text: string) => void,
	LoadFile: (callBack: (text: string) => void) => void,
	LoadFileAsBinary: (callBack: (buffer: ArrayBuffer) => void) => void
}