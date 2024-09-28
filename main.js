// đối tượng
function Main(options){

        var selectorRules = {};

    function validate(inputElement , rule ){
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector('.message');
        // lấy ra các rules của selector
        // var rules = selectorRules[rule.selector];
        // //lặp qua từng rule (check)
        // //nếu có lỗi dừng việc kiểm tra
        //     for(var i =0; i < rules.length; ++i){
        //        errorMessage = rules[i](inputElement.value);
        //        if(errorMessage) break;
        //     }


                    if(errorMessage){
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid');
                    }else{
                        errorElement.innerText = ' ';
                        inputElement.parentElement.classList.remove('invalid');
                    }

                    return !errorMessage;
    }
    //lấy elment của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){


        //khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
            //lặp qua từng rule và valide
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule);
            });

            isFormValid = true;

            options.rules.forEach(function(rule){

                if(Array.isArray(selectorRules[rule.selector])){
                    selectorRules[rule.selector].push(rule.test);
                }else{
                    selectorRules[rule.selector] = [rule.test];
                }
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }

            });


            if(isFormValid){
                if(typeof options.onSubmit ==='function'){

                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValue = Array.from(enableInputs).reduce(function(value,input){
                        value[input.name] = input.value;
                        return value;
                    }, {});
                    options.onSubmit(formValue);

                    
                }
            }
        }

        //lặp qua mỗi rule và xử lý 
        options.rules.forEach(function(rule){

            //lưu lại các rules cho mỗi input
             selectorRules[rule.selector] = rule.test;

            var inputElement = formElement.querySelector(rule.selector);
        
            if(inputElement){
                inputElement.onblur = function () {
                    validate(inputElement , rule);
                }
            } 
        });

         

    }




}

//định nghĩa các rules
Main.isRequired = function(selector){
    return{
        selector : selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui long nhap vao'
        }
    };
}