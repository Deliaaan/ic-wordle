import json

def normalize(s):
    replacements = (
        ("á", "a"),
        ("é", "e"),
        ("í", "i"),
        ("ó", "o"),
        ("ú", "u"),
        ("ü", "u"),
    )
    for a, b in replacements:
        s = s.replace(a, b).replace(a.upper(), b.upper())
    return s

def get_5_letters_words(file_path):
    """
    Reads a file and returns a list of words that are exactly 5 letters long.

    :param file_path: Path to the text file containing words.
    :return: List of 5-letter words.
    """
    five_letter_words = []
    with open(file_path) as file:
        lines_list = file.readlines()
        for line in lines_list:
            word = line.strip()
            if len(word) == 5:
                word_encoded = normalize(word)
                five_letter_words.append(word_encoded)
    unique_five_letter_words = list(set(five_letter_words))
    json.dump(unique_five_letter_words, open('five_letter_words.json', 'w', encoding='utf-8'), ensure_ascii=False)
get_5_letters_words('0_palabras_todas.txt')