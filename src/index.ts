// 2017/12/19 18:23 ~ 19:30
namespace StackLang {
	export type Code = string[];
	export type Item = number | string | any;
	export type Stack = Item[];
	export type Library = (name: string) => (((stack: Stack) => void) | undefined);
	export function run(code: string, stack: Stack = [], lib: Library = defaultLib) {
		return runCommands(code.split(" "), stack, lib);
	}
	export function runCommands(code: Code, stack: Stack, lib: Library) {
		for (let i = 0; i < code.length; i++) {
			const command = code[i];
			try {
				runOneCommand(command, stack, lib);
			} catch (e) {
				throw `${e} @ [line|${i + 1}]`;
			}
		}
		return stack;
	}
	export function runOneCommand(command: string, stack: Stack, lib: Library): Stack {
		let tmp = lib(command);
		if (tmp == undefined) throw `Undefined Command [name|${command}]`;
		tmp(stack);
		return stack;
	}
	export function defaultLib(name: string): ((stack: Stack) => void) | undefined {
		let builtin: Map<string, (stack: Stack) => void> = new Map([
			["+", (stack) => stack.push(stack.pop() + stack.pop())],
			["-", (stack) => stack.push(stack.pop() - stack.pop())],
			["*", (stack) => stack.push(stack.pop() * stack.pop())],
			["/", (stack) => stack.push(stack.pop() / stack.pop())],
			["%", (stack) => stack.push(stack.pop() % stack.pop())],
			["^", (stack) => stack.push(stack.pop() ** stack.pop())],
			["~", (stack) => stack.pop()],
			["&", (stack) => {
				var count = stack.pop();
				var fn = stack.pop();
				var args: Stack = [];
				for (let i = 0; i < count; i++)args.unshift(stack.pop());//TODO: unshift?
				stack.push(fn(...args));
			}],
			["#", (stack) => {
				stack.push(stack[stack.length - stack.pop() - 1]);
			}]
		]);
		if (builtin.has(name)) return builtin.get(name);
		try {
			let tmp = JSON.parse(name);
			return (stack) => stack.push(tmp);
		} catch (e) { 0; }
		let namespaces = name.split(".");
		let current: any = window;
		for (let i = 0; i < namespaces.length && current !== undefined; i++)current = current[namespaces[i]];
		return (stack) => stack.push(current);
	}
}
