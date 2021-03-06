window.PageHub = function() {
    this.container = $('content');
    this.init = function() {
    };

    this.loadPage = function(alias) {
        switch(alias) {
            case 'planets':
                this.clearPage();
                this.loadPagePlanets();
                break;

            case 'research':
                this.clearPage();
                this.loadPageResearch();
                break;

            case 'fleet':
                this.clearPage();
                this.loadPageFleet();
                break;

            default:
                alert('unknown page ' + alias);
        }
    };

    this.clearPage = function() {
        this.container.html('');
    };

    this.loadPagePlanets = function() {
        const $this = this;

        getJSON('hub/planets', function(response) {
            if(response.status !== 200) {
                $this.container.html('<p style="color: ' + getRgb(cRed) + ';">Da Wing-Member häufiger die Allianz verlassen, sind Flotteninformationen etc. nur für die Main Allianz einsehbar.</p>');
            }

            const data = JSON.parse(response.responseText);
            let html = '';

            html += '<p><i class="fa fa-info-circle"></i> <i>Halte die Maus über die Buchstaben, um die Gebäudenamen zu sehen.</i></p>';
            html += '<table class="table519">';
            html += '<tr>';
            html += '<th colspan="3">Koordinaten</th>';
            html += '<th style="text-align: left;">Spieler</th>';
            html += '<th style="text-align: left;">Gebäudepunkte</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Metallmine">M</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Kristallmine">K</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Deuteriumsynthetisierer">D</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Solarkraftwerk">S</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cPink) + '" title="Technodom">T</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Fusionskraftwerk">F</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cBlue) + '" title="Roboterfabrik">R</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cBlue) + '" title="Nanofabrik">N</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Raumschiffwerft">R</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Metallspeicher">M</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Kristallspeicher">K</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Deuteriumtank">D</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cPink) + '" title="Forschungslabor">F</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cBlue) + '" title="Terraformer">T</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Allianzdepot">A</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cYellow) + '" title="Mondbasis">M</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cYellow) + '" title="Phalanx">P</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cYellow) + '" title="Sprungtor">S</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Raketensilo">R</th>';
            html += '</tr>';

            $.each(data, function(key, obj) {
                html += '<tr>';
                html += '<td style="text-align: right; width: 35px">' + obj.galaxy + '</td>';
                html += '<td style="text-align: right; width: 35px">' + obj.system + '</td>';
                html += '<td style="text-align: right; width: 35px">' + obj.planet + '</td>';
                html += '<td style="text-align: left;">' + obj.name + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.score_building || 0) / getMaxValue(data, 'score_building'), cRed) + '">' + (obj.score_building || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.metal_mine || 0) / getMaxValue(data, 'metal_mine'), cRed) + '">' + (obj.metal_mine || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.crystal_mine || 0) / getMaxValue(data, 'crystal_mine'), cRed) + '">' + (obj.crystal_mine || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.deuterium_mine || 0) / getMaxValue(data, 'deuterium_mine'), cRed) + '">' + (obj.deuterium_mine || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.solar_plant || 0) / getMaxValue(data, 'solar_plant'), cRed) + '">' + (obj.solar_plant || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.techno_dome || 0) / getMaxValue(data, 'techno_dome'), cRed) + '">' + (obj.techno_dome || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.fusion_plant || 0) / getMaxValue(data, 'fusion_plant'), cRed) + '">' + (obj.fusion_plant || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.robot_factory || 0) / getMaxValue(data, 'robot_factory'), cRed) + '">' + (obj.robot_factory || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.nano_factory || 0) / getMaxValue(data, 'nano_factory'), cRed) + '">' + (obj.nano_factory || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.hangar || 0) / getMaxValue(data, 'hangar'), cRed) + '">' + (obj.hangar || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.metal_storage || 0) / getMaxValue(data, 'metal_storage'), cRed) + '">' + (obj.metal_storage || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.crystal_storage || 0) / getMaxValue(data, 'crystal_storage'), cRed) + '">' + (obj.crystal_storage || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.deuterium_storage || 0) / getMaxValue(data, 'deuterium_storage'), cRed) + '">' + (obj.deuterium_storage || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.laboratory || 0) / getMaxValue(data, 'laboratory'), cRed) + '">' + (obj.laboratory || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.terra_former || 0) / getMaxValue(data, 'terra_former'), cRed) + '">' + (obj.terra_former || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.alliance_depot || 0) / getMaxValue(data, 'alliance_depot'), cRed) + '">' + (obj.alliance_depot || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.base || 0) / getMaxValue(data, 'base'), cRed) + '">' + (obj.base || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.phalanx || 0) / getMaxValue(data, 'phalanx'), cRed) + '">' + (obj.phalanx || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.portal || 0) / getMaxValue(data, 'portal'), cRed) + '">' + (obj.portal || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.missile_silo || 0) / getMaxValue(data, 'missile_silo'), cRed) + '">' + (obj.missile_silo || '') + '</td>';
                html += '</tr>';
            });

            html += '</table>';

            $this.container.html(html);
        });
    };

    this.loadPageResearch = function() {
        const $this = this;

        getJSON('hub/research', function(response) {
            const data = JSON.parse(response.responseText);
            let html = '';

            html += '<p><i class="fa fa-info-circle"></i> <i>Halte die Maus über die Buchstaben, um die Technologienamen zu sehen.</i></p>';
            html += '<table class="table519">';
            html += '<tr>';
            html += '<td></td>';
            html += '<td></td>';
            html += '<td colspan="2"></td>';
            html += '<td colspan="3">Flottenwert</td>';
            html += '<td colspan="2">Technik</td>';
            html += '<td colspan="3">Triebwerk</td>';
            html += '<td colspan="3">Bewaffnung</td>';
            html += '<td colspan="2"></td>';
            html += '<td colspan="3">Produktion</td>';
            html += '<td></td>';
            html += '</tr>';
            html += '<tr>';
            html += '<th style="text-align: left;">Spieler</th>';
            html += '<th style="text-align: right;">Punkte</th>';
            html += '<th style="text-align: right;" title="Spionagetechnik">S</th>';
            html += '<th style="text-align: right;" title="Computertechnik">C</th>';
            html += '<th style="text-align: right;" title="Waffentechnik">W</th>';
            html += '<th style="text-align: right;" title="Schildtechnik">S</th>';
            html += '<th style="text-align: right;" title="Raumschiffpanzerung">R</th>';
            html += '<th style="text-align: right;" title="Energietechnik">E</th>';
            html += '<th style="text-align: right;" title="Hyperraumtechnik">H</th>';
            html += '<th style="text-align: right;" title="Verbrennungstriebwerk">V</th>';
            html += '<th style="text-align: right;" title="Impulstriebwerk">I</th>';
            html += '<th style="text-align: right;" title="Hyperraumantrieb">H</th>';
            html += '<th style="text-align: right;" title="Lasertechnik">L</th>';
            html += '<th style="text-align: right;" title="Ionentechnik">I</th>';
            html += '<th style="text-align: right;" title="Plasmatechnik">P</th>';
            html += '<th style="text-align: right;" title="Intergalaktisches Forschungsnetzwerk">I</th>';
            html += '<th style="text-align: right;" title="Astrophysik">A</th>';
            html += '<th style="text-align: right;" title="Produktionsmaximierung Metall">M</th>';
            html += '<th style="text-align: right;" title="Produktionsmaximierung Kristall">K</th>';
            html += '<th style="text-align: right;" title="Produktionsmaximierung Deuterium">D</th>';
            html += '<th style="text-align: right;" title="Gravitonforschung">G</th>';
            html += '</tr>';

            $.each(data, function(key, obj) {
                html += '<tr>';
                html += '<td style="text-align: left;">' + obj.name + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.score_science || 0) / getMaxValue(data, 'score_science'), cRed) + '">' + obj.score_science + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.spy_tech || 0) / getMaxValue(data, 'spy_tech'), cRed) + '">' + (obj.spy_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.computer_tech || 0) / getMaxValue(data, 'computer_tech'), cRed) + '">' + (obj.computer_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.military_tech || 0) / getMaxValue(data, 'military_tech'), cRed) + '">' + (obj.military_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.defense_tech || 0) / getMaxValue(data, 'defense_tech'), cRed) + '">' + (obj.defense_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.shield_tech || 0) / getMaxValue(data, 'shield_tech'), cRed) + '">' + (obj.shield_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.energy_tech || 0) / getMaxValue(data, 'energy_tech'), cRed) + '">' + (obj.energy_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.hyperspace_tech || 0) / getMaxValue(data, 'hyperspace_tech'), cRed) + '">' + (obj.hyperspace_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.combustion_tech || 0) / getMaxValue(data, 'combustion_tech'), cRed) + '">' + (obj.combustion_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.impulse_motor_tech || 0) / getMaxValue(data, 'impulse_motor_tech'), cRed) + '">' + (obj.impulse_motor_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.hyperspace_motor_tech || 0) / getMaxValue(data, 'hyperspace_motor_tech'), cRed) + '">' + (obj.hyperspace_motor_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.laser_tech || 0) / getMaxValue(data, 'laser_tech'), cRed) + '">' + (obj.laser_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.ion_tech || 0) / getMaxValue(data, 'ion_tech'), cRed) + '">' + (obj.ion_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.buster_tech || 0) / getMaxValue(data, 'buster_tech'), cRed) + '">' + (obj.buster_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.intergalactic_tech || 0) / getMaxValue(data, 'intergalactic_tech'), cRed) + '">' + (obj.intergalactic_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.expedition_tech || 0) / getMaxValue(data, 'expedition_tech'), cRed) + '">' + (obj.expedition_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.metal_proc_tech || 0) / getMaxValue(data, 'metal_proc_tech'), cRed) + '">' + (obj.metal_proc_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.crystal_proc_tech || 0) / getMaxValue(data, 'crystal_proc_tech'), cRed) + '">' + (obj.crystal_proc_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.deuterium_proc_tech || 0) / getMaxValue(data, 'deuterium_proc_tech'), cRed) + '">' + (obj.deuterium_proc_tech || '') + '</td>';
                html += '<td style="text-align: right; color: ' + getColorAlt(cGreen, parseInt(obj.graviton_tech || 0) / getMaxValue(data, 'graviton_tech'), cRed) + '">' + (obj.graviton_tech || '') + '</td>';
                html += '</tr>';
            });

            html += '</table>';

            $this.container.html(html);
        });
    };

    this.loadPageFleet = function() {
        const $this = this;

        getJSON('hub/fleet', function(response) {
            const data = JSON.parse(response.responseText);
            let html = '';

            html += '<p><i class="fa fa-info-circle"></i> <i>Halte die Maus über die Buchstaben, um die Schiffsnamen zu sehen.</i></p>';
            html += '<table class="table519">';
            html += '<tr>';
            html += '<th style="text-align: left;">Spieler</th>';
            html += '<th style="text-align: right">Punkte</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Kleiner Transporter">KT</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Großer Transporter">GT</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Kolonieschiff">KS</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Recycler">Rec</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Spionagesonden">Spy</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cGreen) + '" title="Solar Satellit">Sat</th>';

            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Leichter Jäger">LJ</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Schwerer Jäger">SJ</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Kreuzer">Xer</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Schlachtschiff">SS</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Bomber">B</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Zerstörer">Z</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Todesstern">DS</th>';
            html += '<th style="text-align: right; color: ' + getRgb(cRed) + '" title="Schlachtkreuzer">SXer</th>';
            html += '</tr>';

            let style;
            $.each(data, function(key, obj) {
                style = obj.name === 'Gesamt' ? 'font-weight: bold; padding-top: 5px; border-top: 1px solid ' + getRgb(cRed) + '; color: ' + getRgb(cRed) : '';
                html += '<tr>';
                html += '<td style="text-align: left; ' + style + '">' + obj.name + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.score_military || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.small_transporters || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.large_transporters || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.coloy_ships || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.recyclers || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.spy_drones || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.solar_satellites || '') + '</td>';

                html += '<td style="text-align: right; ' + style + '">' + (obj.light_hunters || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.heavy_hunters || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.cruisers || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.battleships || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.bombers || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.destroyers || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.death_stars || '') + '</td>';
                html += '<td style="text-align: right; ' + style + '">' + (obj.battle_cruisers || '') + '</td>';
                html += '</tr>';
            });

            html += '</table>';

            $this.container.html(html);
        });
    };
};
