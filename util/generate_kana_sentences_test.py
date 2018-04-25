from generate_kana_sentences import *

def test_all():
    assert get_word_kana('此れ') == 'これ'
    assert get_word_kana('住む') == 'すむ'
    assert parse_full_word('物(もの)[01]{もの}') == ('物', 'もの', '01', 'もの')
    assert is_kana('ぁぬゖァヴ')
    assert not is_kana('abc')
    assert not is_kana('ぁabc')
    assert not is_kana('abcぁ')
    assert convert_word('住む{住んでいる}') == ('すんでいる', ('住', 0, 1))
    assert convert_word('為る(する){して}') == ('して', None)
    #私たち が 其処(そこ){そこ} へ 行く かどうか を 決める の は|1 君(きみ)[01]{君の} 責任 だ
    assert convert_word('私たち') == ('わたしたち', ('私', 0, 3))
    assert convert_word('君(きみ)[01]{君の}') == ('きみの', ('君', 0, 2))
    # Test for edict2 with two readings
    assert convert_word('馬鹿げる{馬鹿げていた}') == ('ばかげていた', ('馬鹿', 0, 2))
    assert convert_word('為る(する){しなかったら}') == ('しなかったら', None)
    assert get_romaji('ばかげていた') == [
        tuple('ば か げ て い た'.split()),
        tuple('ba ka ge te i ta'.split()),
    ]
    assert get_romaji('きゃしゃちゃじゃぢゃ') == [
        tuple('きゃ しゃ ちゃ じゃ ぢゃ'.split()),
        tuple('kya sha cha ja dya'.split()),
    ]
    assert get_romaji('クール') == [
        tuple('ク ー ル'.split()),
        tuple('ku - ru'.split()),
    ]
    assert get_romaji('けんど') == [
        tuple('け ん ど'.split()),
        tuple('ke n do'.split()),
    ]
    assert adjust_indices('りゅ う ね ん'.split(), 0, 5) == (0, 4)
    assert adjust_indices('りゅ う ね ん'.split(), 2, 5) == (1, 4)
    assert adjust_indices('ん りゅ う ね ん'.split(), 0, 1) == (0, 1)
    line = '74076	329644	じゃ 留年~ 為る(する){しなかったら} 付き合う{付き合って} 呉れる{くれん} の タラレバ~ 話(はなし) って 好き(すき) だ{じゃない} の'
    assert parse_jpn_indices_line(line) == (
        'じゃ;りゅ う ね ん;し な か った ら;つ き あ って;く れ ん;の;タ ラ レ バ;は な し;って;す き;じゃ な い;の',
        'ja;ryu u ne n;shi na ka tta ra;tsu ki a tte;ku re n;no;ta ra re ba;ha na shi;tte;su ki;ja na i;no',
        '留年:1:5 付き合:10:13 話:22:25 好:26:27',
        None,
    )
    line = '74036   329684  此の{この} 新聞 は|1 ロハ~ だ'
    assert parse_jpn_indices_line(line) == (
        'こ の;し ん ぶ ん;は;ロ ハ;だ',
        'ko no;shi n bu n;wa;ro ha;da',
        '新聞:2:6',
        None,
    )

    # 74076	329644	じゃ 留年~ 為る(する){しなかったら} 付き合う{付き合って} 呉れる{くれん} の タラレバ~ 話(はなし) って 好き(すき) だ{じゃない} の
    # 74076	jpn	「じゃ留年しなかったら付き合ってくれんの？」「タラレバ話って好きじゃないの」

    # TODO: fix; case where edict2 has two words and this is the second one
    # assert get_word_kana('命に係わる') == 'いのちにかかわる'