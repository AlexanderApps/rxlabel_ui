import csv

def read_csv_as_list(filename):
    with open(filename, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        # Skip the header if needed (optional)
        # next(reader, None)
        for row in reader:
            # row is a list: ['John', 'Doe', '30']
            # print(row)
            print(f"{tuple(row)},")
            # You can access specific columns by index
            # print(f"Name: {row[0]} {row[1]}, Age: {row[2]}")

read_csv_as_list('med_db.csv')


