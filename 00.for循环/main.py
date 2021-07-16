import datetime

start = datetime.datetime.now()
print(start)

sum = 0
len = 20000 #
for i in range(len):
  for j in range(len):
    sum += 1

end = datetime.datetime.now()
print(end)

print(sum)

print((end - start).microseconds)
