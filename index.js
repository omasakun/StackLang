var StackLang;
(function (StackLang) {
    function run(code, stack = [], lib = defaultLib) {
        return runCommands(code.split(" "), stack, lib);
    }
    StackLang.run = run;
    function runCommands(code, stack, lib) {
        for (let i = 0; i < code.length; i++) {
            const command = code[i];
            try {
                runOneCommand(command, stack, lib);
            }
            catch (e) {
                throw `${e} @ [line|${i + 1}]`;
            }
        }
        return stack;
    }
    StackLang.runCommands = runCommands;
    function runOneCommand(command, stack, lib) {
        let tmp = lib(command);
        if (tmp == undefined)
            throw `Undefined Command [name|${command}]`;
        tmp(stack);
        return stack;
    }
    StackLang.runOneCommand = runOneCommand;
    function defaultLib(name) {
        let builtin = new Map([
            ["+", (stack) => stack.push(stack.pop() + stack.pop())],
            ["-", (stack) => stack.push(stack.pop() - stack.pop())],
            ["*", (stack) => stack.push(stack.pop() * stack.pop())],
            ["/", (stack) => stack.push(stack.pop() / stack.pop())],
            ["%", (stack) => stack.push(stack.pop() % stack.pop())],
            ["^", (stack) => stack.push(Math.pow(stack.pop(), stack.pop()))],
            ["~", (stack) => stack.pop()],
            ["&", (stack) => {
                    var count = stack.pop();
                    var fn = stack.pop();
                    var args = [];
                    for (let i = 0; i < count; i++)
                        args.unshift(stack.pop());
                    stack.push(fn(...args));
                }],
            ["#", (stack) => {
                    stack.push(stack[stack.length - stack.pop() - 1]);
                }]
        ]);
        if (builtin.has(name))
            return builtin.get(name);
        try {
            let tmp = JSON.parse(name);
            return (stack) => stack.push(tmp);
        }
        catch (e) {
            0;
        }
        let namespaces = name.split(".");
        let current = window;
        for (let i = 0; i < namespaces.length && current !== undefined; i++)
            current = current[namespaces[i]];
        return (stack) => stack.push(current);
    }
    StackLang.defaultLib = defaultLib;
})(StackLang || (StackLang = {}));
