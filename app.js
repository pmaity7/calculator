const buttons = document.querySelectorAll('.btn');
const placeholder = document.querySelector('#input');
const output = document.querySelector('#output');
let result = 0;
let res;

Array.from(buttons).forEach(element => {
    element.addEventListener('click', () => {
        if (element.id == 'AC'){
            placeholder.textContent = "";
            output.textContent = " ";
            result = false;
        } else if (element.id == 'clear'){
            const l = placeholder.textContent.length;
            placeholder.textContent = placeholder.textContent.slice(0, l-1);
        } else if (element.id == 'plus' || element.id == 'minus' || element.id == 'multiply' || element.id == 'divide' || element.id == 'mod' || element.id == 'power') {
            if(placeholder.textContent.match(/[0-9]$/) && !result)
            {
                placeholder.textContent += ' ' + element.textContent + ' ';
            } else if(placeholder.textContent.match(/\D$/)){
                placeholder.textContent = placeholder.textContent.slice(0,placeholder.textContent.length-2) + ' ' + element.textContent + ' ';
            }
        } else if(element.id == 'equal'){
            let exp = placeholder.textContent;
            let val = infixtopostfix(exp);
            res = postfixEvaluation(val);
            result = true;
            if (String(res).length >= 8) {
                output.textContent = res.toFixed(8);
            }
            else {
                output.textContent = res;
            }
        } else if (element.id == 'round'){
            output.textContent = Math.round(Number(output.textContent));
        } else {
            if (result) {
                placeholder.textContent = element.textContent;
                result = false;
            } else {
                placeholder.textContent += element.textContent;
            }

        }
    });
});

class Stack {
    constructor() {
        this.items = [];
    }

    pushElement(element){
        this.items.push(element);
    }

    popElement(){
        if(this.items.length === 0) {
            return "Underflow";
        }
        return this.items.pop();
    }

    isEmpty(){
        return this.items.length === 0;
    }

    peekElement(){
        return this.items[this.items.length - 1];
    }
}

function infixtopostfix(exp){
    let e = exp.split(' ');
    let stack = new Stack();
    postfix = [];
    for(let i = 0;i<e.length;i++){
        let c = e[i];
        if(!isNaN(parseInt(c))) {
            postfix.push(c);
        } else if(c === '+' || c === '-' || c === '*' || c === '/' || c === '^' || c === '%'){
            while(c!== '^' && !stack.isEmpty() && precedence(c)<= precedence(stack.peekElement())){
                postfix.push(stack.popElement());
            }
            stack.pushElement(c);
        }
    }
    while(!stack.isEmpty()){
        postfix.push(stack.popElement());
    }
    return postfix; 
}

function precedence(op){
    switch(op){
        case '+':
        case '-':
          return 1;
        case '/':
        case '*':
        case '%':
          return 2;
        case '^':
          return 3;
    }
}

function postfixEvaluation(exp){
    var stack = new Stack();
    for (let i = 0;i<exp.length;i++){
        let c = exp[i];
        if(!isNaN(c)) {
            stack.pushElement(c - '0');
        } else {
            var a = stack.popElement();
            var b = stack.popElement();
            if(a === "Underflow" || b === "Underflow"){
                return 'This operation can\'t be performed';
            }
            switch(c){
                case '+':
                    stack.pushElement(a+b);
                    break;
                case '-':
                    stack.pushElement(b-a);
                    break;
                case '*':
                    stack.pushElement(a*b);
                    break;
                case '/':
                    if (a===0){
                        return "Error";
                    }
                    stack.pushElement(b/a);
                    break;
                case '^':
                    stack.pushElement(b**a);
                    break;
                case '%':
                    stack.pushElement(b%a);
                    break;
            }
        }
    }   
    return stack.popElement();
}

