# kuldvillak

## Seadistamine

### Küsimuste loomine
1. Mine kausta `data`.
2. Tee koopia failist `example.json` endale sobiva nimega, nt `minu.json`.  
   *NB! Faili laiend `.json` peab alles jääma.*
3. Ava kopeeritud fail mõnes tekstiredaktoris, nt Notepad.  
   *NB! Rikastekstiredaktorid nagu Word selleks ei sobi.*
4. Muuda ära kategooriate nimed, küsimused ja vastused.
5. Salvesta oma muudatused.

### Süsteemi käivitamine
1. Ava konfiguratsioonifail `config.json`, nt Nopepad-iga.
2. Muutuja `data` väärtuseks pane loodud küsimuste faili nimi, nt `minu`.
3. Muutuja `adminName` väärtuseks pane mingi salajane sõna/fraas, millega pääsed mängu juhtpaneelile ligi.
4. Käivita `START.bat`.
5. Mine veebibrauseris aadressile http://localhost:3000/admin ning sisene punktis 3. valitud salajase nimega.
6. Tee kindlaks süsteemiarvuti IP aadress, nt Windows'i juhtpaneelist võrgu alt vaadates või käsurealt käsuga `ipconfig`. Järgnevates seadistamise sammudes asenda "IP" leitud aadressiga, nt "192.168.1.123".

### Projektori käivitamine
1. Mine teises arvutis või monitori juurde, millega projektorisse pilti näidata.
2. Mine veebibrauseris aadressile http://IP:3000/display ning sisene eelneva peatüki 3. punktis valitud salajase nimega.

### Mängijate ühendamine
1. Mine mingi arvuti või nutiseadme juurde, mida tahad meeskonna vastamispuldina kasutada.
2. Mine veebibrauseris aadressile http://IP:3000/ ning sisene vabalt valitud nimega, mille soovid sellele meeskonnale anda.
3. Korda kõigi meeskondade seadmete jaoks.


## Kasutamine
1. Meeskond valib kategooria ja küsimuse väärtuse.
    1. Administraator klikib juhtpaneelis vastavale küsimusele.
    2. Küsimus loetakse ette.
    3. Administraator klikib "GO" nupul, et meeskonnad saaks alustada vastamisega.
2. Meeskond, kes soovib vastata, vajutab tühikut või klikib oma seadmes avatud veebileheküljel.
    1. Vastata soovivate meeskondade taustad muutuvad erinevateks punasteks nii meeskondade seadmeis, juhtpaneelis kui ka projektoris. Kõige erksam punane tähendab esimesena vajutanud meeskonda, mida heledam (valgem) on punase toon, seda hiljem meeskond vajutas.
    2. Administraator klikib juhtpaneelis kõige punasema taustaga meeskonna nimel, et anda neile vastamisõigus.
3. Meeskonna taustavärv muutub roheliseks ning meeskonnal on 5 sekundit aega anda oma vastus.
    1. Administraator kontrollib vastuse õigsust ainult talle näha olevast juhtpaneelist, kus ainsana näidatakse vastust.
    2. Administraator vajutab meeskonna punktide juures "+" või "-" märki, vastavalt sellele, kas meeskond vastas õigesti või mitte.
       1. Kui meeskond vastas õigesti, siis administraator sulgeb küsimuse üleval paremal nurgas asuvast ristikesest.
       2. Kui meeskond vastas valesti, jätkub vastamine analoogselt.
4. Mäng jätkub seni, kui kõik küsimused on mängulaualt kadunud.
   1. Mõne hetke pärast ilmub projektorisse lõpuküsimuse kategooria.
   2. Meeskonnad saavad teha oma panused, nt paberil.
   3. Administraator klikib "GO" nupul, et avaneks lõpuküsimus.
   4. Meeskonnad saavad ükshaaval võimaluse vastata ning vastuse õigsuse kohaselt, tuleb projektoris kuvatud punktisummale liita või lahutada meeskonna panus.
