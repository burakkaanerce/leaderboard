export default (message, code) => Object.assign(new Error(message), { code })
