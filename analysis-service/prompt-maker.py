import csv

def format_patient_data(row, headings):
    personal_info = """
## Information om personen:
- **Kön**: {Kön}
- **Förnamn**: {Förnamn}
- **Längd**: {Längd}
- **Vikt**: {Vikt}
- **Midjemått**: {Midjemått}
- **Önskad vikt**: {Önskad vikt}
""".format(**row)

    # List of headings to skip
    skip_headings = ['Kön', 'Förnamn', 'E-post', 'Telefonnummer', 'Längd', 'Vikt', 'Midjemått', 'Önskad vikt']

    questions = ""
    for i, heading in enumerate(headings[2:], 1):  # Start from the third heading
        if heading not in skip_headings:
            questions += f"### {heading}\n- **Svar**: {row[heading]}\n\n"

    return personal_info + questions

def main():
    with open('questions.csv', 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        headings = reader.fieldnames
        output = "# Patient Responses\n\n"
        for row in reader:
            output += format_patient_data(row, headings)
            output += "---\n\n"  # Markdown separator between patients

    with open('questions.md', 'w', encoding='utf-8') as md_file:
        md_file.write(output)

if __name__ == "__main__":
    main()
