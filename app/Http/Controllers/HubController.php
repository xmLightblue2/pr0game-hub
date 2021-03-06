<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Exception;
use Illuminate\Support\Facades\DB;

class HubController extends Controller
{
    public function getBuildings()
    {
        $this->checkPermission('getBuildings');

        return Player::query()
            ->select([
                DB::raw('players.name'),
                DB::raw('players.score_building'),
                DB::raw('planets.*')
            ])
            ->join('planets', 'planets.player_id', '=', 'players.id')
            ->whereIn('alliance_id', $this->allianceIds)
            ->orderBy('galaxy')
            ->orderBy('system')
            ->orderBy('planet')
            ->get();
    }

    public function getResearch()
    {
        $this->checkPermission('getResearch');

        return Player::query()
            ->whereIn('alliance_id', $this->allianceIds)
            ->orderBy('name')
            ->get();
    }

    public function getFleet()
    {
        $this->checkPermission('getFleet');

        $return = Player::query()
            ->select([
                DB::raw('MIN(players.name) AS `name`'),
                DB::raw('MIN(players.score_military) AS `score_military`'),
                DB::raw('MIN(planets.galaxy) AS `galaxy`'),
                DB::raw('MIN(planets.system) AS `system`'),
                DB::raw('MIN(planets.planet) AS `planet`'),
                DB::raw('SUM(`small_transporters`) AS `small_transporters`'),
                DB::raw('SUM(`large_transporters`) AS `large_transporters`'),
                DB::raw('SUM(`light_hunters`) AS `light_hunters`'),
                DB::raw('SUM(`heavy_hunters`) AS `heavy_hunters`'),
                DB::raw('SUM(`cruisers`) AS `cruisers`'),
                DB::raw('SUM(`battleships`) AS `battleships`'),
                DB::raw('SUM(`colony_ships`) AS `colony_ships`'),
                DB::raw('SUM(`recyclers`) AS `recyclers`'),
                DB::raw('SUM(`spy_drones`) AS `spy_drones`'),
                DB::raw('SUM(`bombers`) AS `bombers`'),
                DB::raw('SUM(`solar_satellites`) AS `solar_satellites`'),
                DB::raw('SUM(`destroyers`) AS `destroyers`'),
                DB::raw('SUM(`death_stars`) AS `death_stars`'),
                DB::raw('SUM(`battle_cruisers`) AS `battle_cruisers`'),
            ])
            ->join('planets', 'planets.player_id', '=', 'players.id')
            ->whereIn('alliance_id', $this->allianceIds)
            ->groupBy('players.name')
            ->orderBy('players.name')
            ->get();

        $sumRow = [
            'name' => 'Gesamt',
            'score_military' => $return->sum('score_military'),
            'small_transporters' => $return->sum('small_transporters'),
            'large_transporters' => $return->sum('large_transporters'),
            'light_hunters' => $return->sum('light_hunters'),
            'heavy_hunters' => $return->sum('heavy_hunters'),
            'cruisers' => $return->sum('cruisers'),
            'battleships' => $return->sum('battleships'),
            'colony_ships' => $return->sum('colony_ships'),
            'recyclers' => $return->sum('recyclers'),
            'spy_drones' => $return->sum('spy_drones'),
            'bombers' => $return->sum('bombers'),
            'solar_satellites' => $return->sum('solar_satellites'),
            'destroyers' => $return->sum('destroyers'),
            'death_stars' => $return->sum('death_stars'),
            'battle_cruisers' => $return->sum('battle_cruisers'),
        ];

        $return = $return->toArray();
        $return[] = $sumRow;

        return $return;
    }

    private function checkPermission(string $string)
    {
        // not in main ally and not RedStar
        if (auth()->user()->player->alliance_id !== $this->allowedAllianceId && auth()->user()->player_id != 275) {
            throw new Exception('PermissionException');
        }
    }
}
