def jsonify(text, color):
    with open(text, "r") as file:
        thing = list(file)
        last = len(thing)-1
        for i,x in enumerate(thing):
            card = x.replace("\n", "").replace("/ ", "\\n \\n").replace('"', '\\"')
            if "Custom" in x or "___" in x: #the n value is just so that there can be duplicate custom cards
                json.write('        {'+f'"text":"{card}", "color":"{color}",' + f'"Custom": true'+((', "n": ' + str(i)) if "Custom" in x else "")+'}' + (", \n" if i != last else "\n"))
            else:
                json.write('        {'+f'"text":"{card}", "color":"{color}",' + '"Custom": false}' + (", \n" if i != last else "\n"))

if __name__ == "__main__":
    with open(".\\misc\\cards.json", "w") as json:
        json.write('{ \n    "red": [ \n')
        jsonify(".\\misc\\flags.txt", "red") 
        json.write('    ],\n    "white":[ \n')
        jsonify(".\\misc\\perks.txt", "white")
        json.write('    ]\n}')

    print("complete")