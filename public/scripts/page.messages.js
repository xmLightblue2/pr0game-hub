window.PageMessages = function () {
    const messages = $($('#messagestable > tbody > tr').get().reverse());
    let message;
    let messageId;
    let dateTime;
    let expeditionType;
    let expeditionSize;
    let headerText;
    let parseResult;
    let galaxy;
    let system;
    let planet;
    let timestamp;
    let coords;
    let labels;
    let values;
    let resources;

    this.colors = new top.Colors();
    const $this = this;

    this.init = function() {
        messages.each(function (key, obj) {
            // spy report
            if ($(obj).find('.spyRaport').length > 0) {
                $this.parseSpyReport(key, obj);
            } else if ($(obj).find('.raportMessage').length > 0) {
                $this.parseBattleReport(key, obj);
            } else if ($(obj).hasClass('message_head') && $($(obj).find('td')[3]).html().match(/Expeditionsbericht/) !== -1) {
                $this.parseExpedition(key, obj);
            }
        });
    }

    this.parseSpyReport = function(key, obj) {
        dateTime = $(messages[key - 1]).find('td:nth-child(2)').html();

        headerText = $(obj).find('.spyRaportHead a').html();
        parseResult = headerText.match(/Spionagebericht von (.*) \[([0-9]+)\:([0-9]+)\:([0-9]+)\] am (.*)/, headerText);
        galaxy = parseResult[2];
        system = parseResult[3];
        planet = parseResult[4];
        timestamp = parseResult[5];
        coords = galaxy + ':' + system + ':' + planet;

        labels = $(obj).find('.spyRaportContainerRow .spyRaportContainerCell:nth-child(2n+1)');
        values = $(obj).find('.spyRaportContainerRow .spyRaportContainerCell:nth-child(2n)');
        resources = {};

        labels.each(function (labelKey, label) {
            resources[($(label).find('a').attr('onclick') || '').match(/\(([0-9]+)\)/)[1]] = getInt($(values[labelKey]).html());
        });

        postJSON('spy-reports', {
            id: parseInt($(obj).attr('class').match(/message\_([0-9]+)/)[1]),
            galaxy: parseInt(parseResult[2]),
            system: parseInt(parseResult[3]),
            planet: parseInt(parseResult[4]),
            timestamp: parseResult[5],
            resources: resources
        }, function (response) {
        });
    }

    this.parseBattleReport = function(key, obj) {
        var html = $(obj).html();
        var parseResult = getCoordinates($(obj).find('.raportMessage').html());

        postJSON('battle-reports', {
            report_id: html.match(/(raport|report)\=([^"]{32})/)[2],
            galaxy: parseInt(parseResult[1]),
            system: parseInt(parseResult[2]),
            planet: parseInt(parseResult[3]),
            attacker_lost: getInt(html.match(/Angreifer\: ([\.0-9]+)\</)[1]),
            defender_lost: getInt(html.match(/Verteidiger\: ([\.0-9]+)\</)[1]),
            metal: getInt(html.match(/(reportSteal|raportSteal) element901\"\>([\.0-9]+)\</)[2]),
            crystal: getInt(html.match(/(reportSteal|raportSteal) element902\"\>([\.0-9]+)\</)[2]),
            deuterium: getInt(html.match(/(reportSteal|raportSteal) element903\"\>([\.0-9]+)\</)[2]),
            debris_metal: getInt(html.match(/(reportDebris|raportDebris) element901\"\>([\.0-9]+)\</)[2]),
            debris_crystal: getInt(html.match(/(reportDebris|raportDebris) element902\"\>([\.0-9]+)\</)[2]),
            timestamp: $(messages[key + 1]).find('td:nth-child(2)').html()
        }, function (response) {
        });
    }

    this.parseExpedition = function(key, obj) {
        messageId = $(obj).attr('id').replace(/message\_/, '');
        dateTime = $(obj).hasClass('message_head') && $($(obj).find('td')[1]).html();

        $($(messages[key - 1]).find('td')).html($($(messages[key - 1]).find('td')).html().replace(/Logbuch Nachtrag des Kommunikationsoffiziers: Dieser Bereich des Universums ist wohl noch nicht erkundet worden./, '<span style="color: ' + $this.colors.green() + '"><i class="fa fa-check"></i></span> Logbuch Nachtrag des Kommunikationsoffiziers: Dieser Bereich des Universums ist wohl noch nicht erkundet worden.'));
        $($(messages[key - 1]).find('td')).html($($(messages[key - 1]).find('td')).html().replace(/Logbuch Nachtrag des Kommunikationsoffiziers: Es ist ein erhebendes Gef??hl, der Erste in einem unerforschten Sektor zu sein./, '<span style="color: ' + $this.colors.green() + '"><i class="fa fa-check"></i></span> Logbuch Nachtrag des Kommunikationsoffiziers: Es ist ein erhebendes Gef??hl, der Erste in einem unerforschten Sektor zu sein.'));
        $($(messages[key - 1]).find('td')).html($($(messages[key - 1]).find('td')).html().replace(/Logbuch Nachtrag des Kommunikationsoffiziers: Es scheint nicht so, als ob jemals ein Mensch in diesem Bereich der Galaxis gewesen w??re./, '<span style="color: ' + $this.colors.red() + '"><i class="fa fa-exclamation-triangle"></i> 25%</span> Logbuch Nachtrag des Kommunikationsoffiziers: Es scheint nicht so, als ob jemals ein Mensch in diesem Bereich der Galaxis gewesen w??re.'));
        $($(messages[key - 1]).find('td')).html($($(messages[key - 1]).find('td')).html().replace(/Logbuch Nachtrag des Kommunikationsoffiziers: Es wurden Anzeichen f??r die Pr??senz anderer Expeditionsflotten gefunden./, '<span style="color: ' + $this.colors.red() + '"><i class="fa fa-exclamation-triangle"></i> 50%</span> Logbuch Nachtrag des Kommunikationsoffiziers: Es wurden Anzeichen f??r die Pr??senz anderer Expeditionsflotten gefunden.'));
        $($(messages[key - 1]).find('td')).html($($(messages[key - 1]).find('td')).html().replace(/Logbuch Nachtrag des Kommunikationsoffiziers: Wenn wir uns zu unsicher f??hlen, k??nnen wir uns ja mit all den anderen Expeditionen, die hier herum fliegen, zusammen tun./, '<span style="color: ' + $this.colors.red() + '"><i class="fa fa-exclamation-triangle"></i> 75%</span> Logbuch Nachtrag des Kommunikationsoffiziers: Wenn wir uns zu unsicher f??hlen, k??nnen wir uns ja mit all den anderen Expeditionen, die hier herum fliegen, zusammen tun.'));

        message = $($(messages[key - 1]).find('td')).html();
        expeditionType = 'UNKNOWN';
        expeditionSize = null;

        if (message.match(/Deine Expedition hat einen kleinen Asteroidenschwarm entdeckt, aus dem einige Ressourcen gewonnen werden k??nnen./)
            || message.match(/Auf einem abgelegenen Planetoiden wurden einige leicht zug??ngliche Ressourcenfelder gefunden und erfolgreich Rohstoffe gewonnen./)
            || message.match(/Deine Expedition stie?? auf sehr alte Raumschiffwracks einer l??ngst vergangenen Schlacht. Einzelne Komponenten konnte man bergen und recyceln./)
            || message.match(/Die Expedition stie?? auf einen radioaktiv verstrahlten Planetoiden mit hochgiftiger Atmosph??re. Jedoch ergaben Scans, dass dieser Planetoid sehr rohstoffhaltig ist. Mittels automatischer Drohnen wurde versucht, ein Maximum an Rohstoffen zu gewinnen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ress">Ress (klein)</span>');
            expeditionType = 'RESOURCE';
            expeditionSize = 'SMALL';
        }

        if (message.match(/Deine Expedition fand einen uralten, voll beladenen, aber menschenleeren Frachterkonvoi. Einige Ressourcen konnten geborgen werden./)
            || message.match(/Auf einem kleinen Mond mit eigener Atmosph??re fand deine Expedition gro??e Rohstoffvorkommen. Die Bodencrews sind dabei diese nat??rlichen Sch??tze zu heben./)
            || message.match(/Wir haben einen kleinen Konvoi ziviler Schiffe getroffen, die dringend Nahrung und Medikamente ben??tigten. Im Austausch daf??r erhielten wir eine ganze Menge n??tzlicher Ressourcen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ress">ress (mittel)</span>');
            expeditionType = 'RESOURCE';
            expeditionSize = 'MEDIUM';
        }

        if (message.match(/Deine Expeditionsflotte meldet den Fund eines riesigen Alien-Schiffswracks. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff lie?? sich in seine Einzelteile zerlegen und dadurch konnte man wertvolle Rohstoffe gewinnen./)
            || message.match(/Ein Mineralieng??rtel um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!/)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ress">ress (gro??)</span>');
            expeditionType = 'RESOURCE';
            expeditionSize = 'LARGE';
        }

        if (message.match(/Wir sind auf die ??berreste einer Vorg??ngerexpedition gesto??en! Unsere Techniker schauen, ob sie einige der Wracks wieder Flugf??hig bekommen/)
            || message.match(/Wir haben eine verlassene Piratenbasis gefunden. Im Hangar liegen noch einige alte Schiffe. Unsere Techniker schauen nach, ob einige davon noch zu gebrauchen sind./)
            || message.match(/Unsere Expedition fand einen Planeten, der wohl durch anhaltende Kriege fast komplett zerst??rt wurde. In der Umlaufbahn trieben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information dar??ber, was hier geschehen ist./)
            || message.match(/Deine Expedition ist auf eine alte Sternenfestung gesto??en, die wohl seit Ewigkeiten verlassen ist. Im Hangar der Festung wurden ein paar Schiffe gefunden. Die Techniker schauen, ob sie einige davon wieder flott bekommen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ships">Schiffe (klein)</span>');
            $($(messages[key - 1]).find('td')).html(message.replace(/([ a-zA-Z??????????????]+)\: ([.0-9]+)/g, '<span style="color: ' + $this.colors.red() + ';">$1: $2</span>'));
            expeditionType = 'FLEET';
            expeditionSize = 'SMALL';
        }

        if (message.match(/Wir haben die Reste einer Armada gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instandzusetzen./)
            || message.match(/Unsere Expedition stie?? auf eine alte, automatische Schiffswerft. Einige Schiffe sind noch in der Produktionsphase, und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ships">Schiffe (mittel)</span>');
            $($(messages[key - 1]).find('td')).html(message.replace(/([ a-zA-Z??????????????]+)\: ([.0-9]+)/g, '<span style="color: ' + $this.colors.red() + ';">$1: $2</span>'));
            expeditionType = 'FLEET';
            expeditionSize = 'MEDIUM';
        }

        if (message.match(/Wir haben einen riesigen Raumschiffsfriedhof gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das eine oder andere Schiff wieder in Betrieb zu nehmen./)
            || message.match(/Wir haben einen Planeten mit Resten einer Zivilisation entdeckt. Aus dem Orbit ist noch ein riesiger Raumbahnhof zu erkennen, der als einziges Geb??ude noch intakt ist. Einige unserer Techniker und Piloten haben sich auf die Oberfl??che begeben um nachzuschauen, ob ein paar der dort abgestellten Schiffe noch zu gebrauchen sind./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-ships">Schiffe (gro??)</span>');
            $($(messages[key - 1]).find('td')).html(message.replace(/([ a-zA-Z??????????????]+)\: ([.0-9]+)/g, '<span style="color: ' + $this.colors.red() + ';">$1: $2</span>'));
            expeditionType = 'FLEET';
            expeditionSize = 'LARGE';
        }

        if (message.match(/Au??er einiger kurioser, kleiner Tierchen von einem unbekannten Sumpfplaneten, bringt diese Expedition nichts Aufregendes von ihrer Reise mit./)
            || message.match(/Deine Expedition hat wundersch??ne Bilder einer Supernova gemacht. Wirklich neue Erkenntnisse hat diese Expedition jedoch nicht gebracht. Aber man hat gute Chancen auf den Bestes-Bild-Des-Universums-Wettbewerb in diesem Jahr./)
            || message.match(/Ein seltsames Computervirus legte kurz nach Verlassen des Sonnensystems die Navigation lahm. Dies f??hrte dazu, dass die gesamte Expeditionsflotte die ganze Zeit im Kreis flog. ??berfl??ssig zu sagen, dass die Expedition nicht besonders erfolgreich war./)
            || message.match(/Eine Lebensform aus reiner Energie hat daf??r gesorgt, dass s??mtliche Expeditionsmitglieder tagelang auf die hypnotischen Muster auf den Bildschirmen starrten. Als endlich die Meisten wieder klar im Kopf geworden waren, musste die Expedition aufgrund von akutem Deuterium-Mangel allerdings abgebrochen werden./)
            || message.match(/Nun, zumindest wei?? man jetzt, dass rote Anomalien der Klasse 5 nicht nur chaotische Auswirkungen auf die Schiffssysteme haben, sondern auch massive Halluzinationen bei der Crew ausl??sen k??nnen. Viel mehr hat diese Expedition aber nicht gebracht./)
            || message.match(/Trotz der ersten, vielversprechenden Scans dieses Sektors kommen wir leider mit leeren H??nden zur??ck./)
            || message.match(/Vielleicht h??tte man den Geburtstag des Captains nicht auf diesem abgelegenen Planeten feiern sollen. Ein fieses Dschungelfieber hat gro??e Teile der Crew gezwungen die Expedition in der Krankenstation zu begleiten. Der akute Personalausfall f??hrte dazu, dass die Expedition scheiterte./)
            || message.match(/Deine Expedition hat, wortw??rtlich, mit der Leere des Alls Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden, oder Strahlung, oder Partikel, oder irgendetwas, dass diese Expedition aufregend gestaltet h??tte/)
            || message.match(/Ein Reaktorfehler des F??hrungsschiffes h??tte beinahe die gesamte Expedition vernichtet. Zum Gl??ck waren die Techniker mehr als f??hig und konnten das Schlimmste verhindern. Die Reparatur nahm jedoch soviel Zeit in Anspruch, dass die Expedition unverrichteter Dinge wieder zur??ckkehrte./)
            || message.match(/Es konnten keine Schiffe repariert werden./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-nothing">nichts</span>');
            expeditionType = 'NOTHING';
            expeditionSize = null;
        }

        if (message.match(/Eine unvorhergesehene R??ckkopplung in den Energiespulen der Antriebsaggregate beschleunigte den R??cksprung der Expedition, so dass sie nun fr??her als erwartet zur??ckkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten./)
            || message.match(/Der etwas wagemutige neue Kommandant nutzte ein instabiles Wurmloch, um den R??ckflug zu verk??rzen ??? mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht./)
            || message.match(/Deine Expedition meldet keinen Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte beim R??cksprung in einen Sonnenwind. Dadurch wurde der Sprung ziemlich beschleunigt. Deine Expedition kehrt nun etwas fr??her nach Hause./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-nothing">nichts (schnell)</span>');
            expeditionType = 'NOTHING_FAST';
            expeditionSize = null;
        }

        if (message.match(/Ein b??ser Patzer des Navigators f??hrte zu einer Fehlkalkulation beim Sprung der Expedition. Nicht nur landete die Flotte an einem v??llig falschen Ort, auch der R??ckweg nahm nun erheblich mehr Zeit in Anspruch./)
            || message.match(/Aus bisher unbekannten Gr??nden, ging der Sprung der Expeditionsflotte v??llig daneben. Beinahe w??re man im Herzen einer Sonne herausgekommen. Zum Gl??ck ist man in einem bekannten System gelandet, jedoch wird der R??cksprung l??nger dauern als urspr??nglich gedacht./)
            || message.match(/Das neue Navigationsmodul hat wohl doch noch mit einigen Bugs zu k??mpfen. Nicht nur ging der Sprung der Expeditionsflotte in die v??llig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas entt??uscht kehrt die Expedition nun auf Impuls zur??ck. Dadurch wird die R??ckkehr wohl ein wenig verz??gert./)
            || message.match(/Deine Expedition geriet in einen Sektor mit verst??rkten Partikelst??rmen. Dadurch ??berluden sich die Energiespeicher der Flotte und bei s??mtlichen Schiffen fielen die Hauptsysteme aus. Deine Mechaniker konnten das Schlimmste verhindern, jedoch wird die Expedition nun mit einiger Versp??tung zur??ckkehren./)
            || message.match(/Das F??hrungsschiff deiner Expeditionsflotte kollidierte mit einem fremden Schiff, das ohne Vorwarnung direkt in die Flotte sprang. Das fremde Schiff explodierte und die Sch??den am F??hrungsschiff waren beachtlich. Sobald die gr??bsten Reparaturen abgeschlossen sind, werden sich deine Schiffe auf den R??ckweg machen, da in diesem Zustand die Expedition nicht fortgef??hrt werden kann./)
            || message.match(/Der Sternwind eines roten Riesen verf??lschte den Sprung der Expedition derma??en, dass es einige Zeit dauerte, den R??cksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition herauskam, nichts au??er der Leere zwischen den Sternen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-nothing">nichts (langsam)</span>');
            expeditionType = 'NOTHING_SLOW';
            expeditionSize = null;
        }

        if (message.match(/Ein paar anscheinend sehr verzweifelte Weltraumpiraten haben versucht, unsere Expeditionsflotte zu kapern./)
            || message.match(/Einige primitive Barbaren greifen uns mit Raumschiffen an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernst zu nehmende Ausma??e annehmen, sehen wir uns gezwungen das Feuer zu erwidern./)
            || message.match(/Wir haben ein paar Funkspr??che sehr betrunkener Piraten aufgefangen. Anscheinend sollen wir ??berfallen werden./)
            || message.match(/Wir mussten uns gegen einige Piraten wehren, die zum Gl??ck nicht allzu zahlreich waren./)
            || message.match(/Unsere Expeditionsflotte meldet, dass ein gewisser Moa Tikarr und seine wilde Meute die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen m??ssen, dass sich unsere Schiffe durchaus zu wehren wissen./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Piraten (klein)</span>');
            expeditionType = 'PIRATES';
            expeditionSize = 'SMALL';
        }

        if (message.match(/Deine Expeditionsflotte hatte ein unsch??nes Zusammentreffen mit einigen Weltraumpiraten./)
            || message.match(/Wir sind in den Hinterhalt einiger Sternen-Freibeuter geraten! Ein Kampf war leider unvermeidlich./)
            || message.match(/Der Hilferuf, dem die Expedition folgte, stellte sich als b??se Falle einiger arglistiger Sternen-Freibeuter heraus. Ein Gefecht war unvermeidlich./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Piraten (mittel)</span>');
            expeditionType = 'PIRATES';
            expeditionSize = 'MEDIUM';
        }

        if (message.match(/Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern von einer geheimen Piratenbasis! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert./)
            || message.match(/Die Expeditionsflotte meldet schwere K??mpfe mit nicht-identifizierten Piratenschiffen!/)
            || message.match(/Wir haben gerade eine dringende Nachricht vom Expeditionskommandanten erhalten: "Sie kommen auf uns zu! Sie sind aus dem Hyperraum gesprungen, zum Gl??ck sind es nur Piraten, wir haben also eine Chance, wir werden k??mpfen!"/)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Piraten (gro??)</span>');
            expeditionType = 'PIRATES';
            expeditionSize = 'LARGE';
        }

        if (message.match(/Deine Expeditionsflotte hatte einen nicht besonders freundlichen Erstkontakt mit einer unbekannten Spezies./)
            || message.match(/Einige fremdartig anmutende Schiffe haben ohne Vorwarnung die Expeditionsflotte angegriffen!/)
            || message.match(/Unsere Expedition wurde von einer kleinen Gruppe unbekannter Schiffe angegriffen!/)
            || message.match(/Die Expeditionsflotte meldet Kontakt mit unbekannten Schiffen. Die Funkspr??che sind nicht entschl??sselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Aliens (klein)</span>');
            expeditionType = 'ALIENS';
            expeditionSize = 'SMALL';
        }

        if (message.match(/Eine unbekannte Spezies greift unsere Expedition an!/)
            || message.match(/Deine Expeditionsflotte hat anscheinend das Hoheitsgebiet einer bisher unbekannten, aber ??u??erst aggressiven und kriegerischen Alienrasse verletzt./)
            || message.match(/Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gest??rt. Soweit wir die letzte Botschaft richtig entschl??sselt haben, steht die Flotte unter schwerem Feuer ??? die Aggressoren konnten nicht identifiziert werden./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Aliens (mittel)</span>');
            expeditionType = 'ALIENS';
            expeditionSize = 'MEDIUM';
        }

        if (message.match(/Deine Expedition ist in eine Alien-Invasions-Flotte geraten und meldet schwere Gefechte!/)
            || message.match(/Ein gro??er Verband kristalliner Schiffe unbekannter Herkunft h??lt direkten Kollisionskurs mit unserer Expeditionsflotte. Wir m??ssen nun wohl vom Schlimmsten ausgehen./)
            || message.match(/Wir hatten ein wenig Schwierigkeiten, den Dialekt der fremden Rasse richtig auszusprechen. Unser Diplomat nannte versehentlich "Feuer!" statt "Frieden!"./)
        ) {
            $($(obj).find('td')[3]).html('<span class="badge badge-fight">Aliens (gro??)</span>');
            expeditionType = 'ALIENS';
            expeditionSize = 'LARGE';
        }

        postJSON('expeditions', {
            external_id: messageId,
            date_time: dateTime,
            type: expeditionType,
            size: expeditionSize,
            message
        }, function () {
        });
    }
};
