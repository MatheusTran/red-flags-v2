import gpt_2_simple as gpt

save = input("save: ")
action = input("re-train model? (y/n)")

sess = gpt.start_tf_sess()
if action == "y":
    file = input("file: ")
    steps = input("steps: ")
    gpt.finetune(sess, dataset=f"..\\{file}", steps=steps, model_name="124m",run_name=save,
                sample_every=10, save_every=10,print_every=1, restore_from="fresh")
else:
    gpt.load_gpt2(sess,run_name=save, reuse=True,model_name="124m")
length = int(input("\nlength: "))

command = ""

while command != "stop":
    print("generating...\n")
    gpt.generate(sess, run_name=save, length=length)
    command = input()