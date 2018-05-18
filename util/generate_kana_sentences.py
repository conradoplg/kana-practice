import re
import os
import sys
import unicodedata
import kana_info
import romkan.common

_WORD_RE = re.compile(r'^(\w+)(\|\d+)?(\(\w+\))?(\[\d+\])?(\{\w+\})?~?')
_KANA_RE = re.compile(r'^[\u30a0-\u30ff\u3040-\u309f]+$')
_KANA_SPLIT_RE = re.compile(r'([\u30a0-\u30ff\u3040-\u309f]+)')


def get_romaji(s):
    """
    Convert a Kana (仮名) to a Hepburn Romaji (ヘボン式ローマ字).

    It returns two values; the first is a tuple with the kana "syllables", and the second is
    a tuple with the same number of values with the corresponding romaji.
    """
    # This is adapted from romkan to_roma function. It just returns a string, but we need to
    # get it separated by "syllables"
    KANROM = romkan.common.KANROM
    KANROM_H = romkan.common.KANROM_H
    cmp_to_key = romkan.common.cmp_to_key

    def _kanpat_cmp(x, y): return (len(y) > len(x)) - (len(y) < len(x)) or (
        len(KANROM[x]) > len(KANROM[x])) - (len(KANROM[x]) < len(KANROM[x]))
    KANPAT = "|".join(sorted(KANROM.keys(), key=cmp_to_key(_kanpat_cmp)))

    def _kanpat_cmp(x, y): return (len(y) > len(x)) - (len(y) < len(x)) or (
        len(KANROM_H[x]) > len(KANROM_H[x])) - (len(KANROM_H[x]) < len(KANROM_H[x]))
    KANPAT_H = "|".join(sorted(KANROM_H.keys(), key=cmp_to_key(_kanpat_cmp)))
    pat = re.compile('|'.join((KANPAT, KANPAT_H)))

    r = []

    def subk(x):
        romaji = KANROM.get(x.group(0), KANROM_H.get(x.group(0)))
        # Don't care about apostrophe since we are splitting by "syllables" anyway
        romaji = romaji.replace("n'", "n")
        r.append((x.group(0), romaji))
        # Since we need to separate by "syllable", we'll get the result through the list 'r'.
        # The return value here does not matter
        return ''

    pat.sub(subk, s)

    return list(zip(*r))


def is_kana(s):
    return _KANA_RE.match(s)


def initialize_word_kana():
    d = {}
    # TODO: this is actually wrong. edict2 can have multiple words in one line; handle it.
    # Currently, this sees only the first word.
    regex = re.compile(r'^(\w+)\W[^\[]*\[([^\](;]+)')
    with open('util/edict2', encoding='utf-8') as f:
        for line in f:
            m = regex.match(line)
            if m:
                d[m.group(1)] = m.group(2)
    return d


_WORD_KANA = initialize_word_kana()


def get_word_kana(word):
    """
    Given a "word", return it as kana.

    Uses edict2.
    """
    return _WORD_KANA.get(word)


def parse_full_word(full_word):
    """
    Parse a Tanaka corpus line B "full word" (e.g. "此れ[01]{これ}").
    """
    m = _WORD_RE.match(full_word)
    if not m:
        raise RuntimeError('Unable to match: ' + full_word)
    word, _, reading, sense, form = m.groups()
    if reading:
        reading = reading[1:-1]
    if sense:
        sense = sense[1:-1]
    if form:
        form = form[1:-1]
    return word, reading, sense, form


def adjust_indices(split_kana, start, end):
    """
    Adjust indices from a kana word to match kana syllables.

    convert_word returns kanjis and the indices into the kana string, e.g.
    convert_word('留年') == ('りゅうねん', (留年, 0, 5))

    However, after we split the kana into syllables, we need to adjust the indices, e.g.
    after converting to ['りゅ', 'う', 'ね', 'ん'], the indices are now (0, 4).
    """
    kana_pos = 0
    for syllable in split_kana:
        if kana_pos < start:
            start -= len(syllable) - 1
        if kana_pos < end:
            end -= len(syllable) - 1
        kana_pos += len(syllable)
    return start, end

def convert_word(full_word):
    word, reading, sense, form = parse_full_word(full_word)
    if reading:
        word_kana = reading
    elif is_kana(word):
        word_kana = word
    else:
        word_kana = get_word_kana(word)
        if not word_kana:
            raise RuntimeError(
                'get_word_kana({}) returned None'.format(repr(word)))
    if form:
        if is_kana(form):
            return form, []
        # Assuming form is kanjis + kana.
        # Find the kana for "kanjis"
        kana_suffix = os.path.commonprefix([word[::-1], word_kana[::-1]])[::-1]
        kanji_prefix = word[:len(word) - len(kana_suffix)]
        kanji_prefix_kana = word_kana[:len(word_kana) - len(kana_suffix)]
        if not form.startswith(kanji_prefix):
            raise RuntimeError('form does not start with the kanji prefix {}; full_word={}'.format(
                repr(kanji_prefix), repr(full_word)))
        word_kana = kanji_prefix_kana + form[len(kanji_prefix):]
    if not is_kana(word_kana):
        raise RuntimeError('convert_word failed to convert entirely to kana; full_word={}; word_kana={}'.format(
            repr(full_word), repr(word_kana)))
    if form:
        word = form

    parts = [p for p in re.split(_KANA_SPLIT_RE, word) if len(p) > 0]
    regex = ''
    for p in parts:
        if is_kana(p[0]):
            regex += p
        else:
            regex += '(.+)'
    m = re.fullmatch(regex, word_kana)
    if not m:
        raise RuntimeError('convert_word failed to match kanji with kana; word={}; word_kana={}, regex={}'.format(
            repr(word), repr(word_kana), repr(regex)))
    kanji_info_list = []
    pos = 0
    mi = 1
    for p in parts:
        if is_kana(p[0]):
            pos += len(p)
        else:
            size = len(m.group(mi))
            kanji_info_list.append((p, pos, pos + size))
            mi += 1
            pos += size
    return word_kana, kanji_info_list


def parse_jpn_indices_line(line):
    arr = line.strip().split(maxsplit=2)
    if len(arr) != 3:
        return None, None, 'line {} does not have 3 fields'.format(repr(line))
    sentence = arr[2]
    try:
        split_kana_sentence = []
        split_romaji_sentence = []
        kanji_info_list = []
        pos = 0
        for word in sentence.split():
            word_kana, word_kanji_info_list = convert_word(word)
            split_word_kana, split_word_romaji = get_romaji(word_kana)
            if split_word_romaji == ('ha',):
                split_word_romaji = ('wa',)
            split_kana_sentence.append(' '.join(split_word_kana))
            split_romaji_sentence.append(' '.join(split_word_romaji))
            for kanji_info in word_kanji_info_list:
                kanji, start, end = kanji_info
                start, end = adjust_indices(split_word_kana, start, end)
                kanji_info_list.append('{}:{}:{}'.format(kanji, pos + start, pos + end))
            pos += len(split_word_kana)
        return (';'.join(split_kana_sentence), ';'.join(split_romaji_sentence),
            ' '.join(kanji_info_list), None)
    except RuntimeError:
        import traceback
        tb = traceback.format_exc()
        error = '{}\n{}'.format(sentence, tb)
        return None, None, None, error


def get_romaji_syllable_list():
    return [romaji for kana, romaji in sorted(romkan.common.KANROM.items())]


def get_katakana_syllable_list():
    return sorted(romkan.common.KANROM.keys())


def get_hiragana_syllable_list():
    return sorted(romkan.common.KANROM_H.keys())


def main():
    with open('util/jpn_indices_short.csv', encoding='utf-8') as f:
        for line in f:
            kana_sentence, romaji_sentence, kanji_info, error = parse_jpn_indices_line(line)
            if error:
                print(error, file=sys.stderr)
            else:
                print(kana_sentence, romaji_sentence, kanji_info, sep=',')


if __name__ == '__main__':
    # print(get_katakana_syllable_list())
    # print(get_hiragana_syllable_list())
    # print(get_romaji_syllable_list())
    main()
