
var LIST_OPEN_BRACKET = '{'
var LIST_CLOSED_BRACKET = '}'

function on_list_button_click(event){
    event.preventDefault();
    let json = document.getElementById("json").value;


    list_of_keys = document.getElementById("keys_list");
    list_of_values = document.getElementById("values_list");

    json = put_all_values_in_quotes(json);
    console.log(json);
    let [keys,values] = get_lists_from_json(json);
    list_of_keys.innerText = keys;
    list_of_values.innerText = values;
}

//wraps every non-string value in quotes
function put_all_values_in_quotes(json){
    let is_value = false;
    let start_of_value = -1;
    const stack = [];

    const end_of_value_delimeter = [',','{','}','[',']'];
    for(let i = 0; i < json.length; i++){
        //values handling, puttinh all unquoted values into quotes
        if(is_value){
            if(json[i] == '"'){
                is_value = false;
            }
            
            if(end_of_value_delimeter.includes(json[i])){
                is_value = false;
                if(start_of_value != -1)
                    json = [json.slice(0, start_of_value), '"' + json.substring(start_of_value,i).trim() + '"', json.slice(i)].join('');
            }

            if(json[i] != ' ' && start_of_value == -1){
                start_of_value = i;
            }
            
        }

        //usual ways to distinguish values from keys
        if(json[i] == ':' || json[i] == '['){
            is_value = true;
            start_of_value = -1;
        }

        //for array values
        if(json[i] == '[' || json[i] == '{'){
            stack.push(json[i]);
        }
        if(json[i] == ']' || json[i] == '}'){
            stack.pop();
        }
        if(json[i] == ',' && stack.length > 0){
            if(stack[stack.length - 1] == '['){
                is_value = true;
                start_of_value = -1;
            }
        }
    }

    return json;
}


//can only parse jsons that consist only of string values
function get_lists_from_json(json){
    let keys = "";
    let values = "";
    const stack = [];
    
    //parsing json
    let inside_quotes = false;
    let is_key = true;
    let inclusions_number = 0;
    let previous_quotation = 0;
    let substring = "";

    for(let i = 0; i < json.length; i++){
        //quotation marks signal that we need to put value in keys or values
        if(json[i] == '"'){
            if(inside_quotes){
                substring = json.substring(1+previous_quotation, i);
                if(is_key)
                    keys += substring;
                else
                    values += substring;
            }

            inside_quotes = !inside_quotes; 
            previous_quotation = i;
        }

        //to determine if what we look at is a key or a value we look into the syntax
        if(!inside_quotes){
            //this shows that this is a value
            if(json[i] == ':'){
                is_key = !is_key;
            }
            //this is for keeping track of arrays and adding in syntax
            if(json[i] == '[' || json[i] == ']'){
                keys += json[i];
                values += json[i];
                if(json[i] == '['){
                    stack.push('[');
                }
                else{
                    stack.pop();
                }
            }
            //this is for keeping track of objects and adding in syntax, we reset counter for key_value because objects start with a key
            if(json[i] == '{' || json[i] == '}'){
                is_key = true;
                keys += " "+ json[i] + " ";
                values += " "+json[i] + " ";
                if(json[i] == '{'){
                    stack.push('{');
                }
                else{
                    stack.pop();
                }
            }
            //this resets the counter for key_value correctly depending if we are handling an array or an object
            if(json[i] == ','){
                values += json[i] + " "; 
                if(stack.length != 0)
                    if(stack[stack.length - 1] == '['){
                        is_key = false;
                    }
                    else{
                        is_key = true;
                        keys += json[i] + " ";
                    }
            }
        }

    }

    return [keys,values];
}