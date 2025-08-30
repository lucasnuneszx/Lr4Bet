const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Listar todas as categorias esportivas
router.get('/categories', async (req, res) => {
    try {
        const categories = await query(
            'SELECT * FROM sport_categories WHERE is_active = TRUE ORDER BY name'
        );
        
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar ligas por categoria
router.get('/categories/:categoryId/leagues', async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const leagues = await query(
            `SELECT l.*, sc.name as sport_name 
             FROM leagues l
             JOIN sport_categories sc ON l.sport_category_id = sc.id
             WHERE l.sport_category_id = ? AND l.is_active = TRUE
             ORDER BY l.name`,
            [categoryId]
        );
        
        res.json({
            success: true,
            leagues
        });
    } catch (error) {
        console.error('Erro ao buscar ligas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Listar jogos por liga
router.get('/leagues/:leagueId/matches', async (req, res) => {
    try {
        const { leagueId } = req.params;
        const { status, date } = req.query;
        
        let whereClause = 'WHERE m.league_id = ? AND m.is_active = TRUE';
        let params = [leagueId];
        
        if (status && status !== 'all') {
            whereClause += ' AND m.status = ?';
            params.push(status);
        }
        
        if (date) {
            whereClause += ' AND DATE(m.match_date) = ?';
            params.push(date);
        }
        
        const matches = await query(
            `SELECT m.*, 
                    ht.name as home_team_name, ht.short_name as home_team_short, ht.logo as home_team_logo,
                    at.name as away_team_name, at.short_name as away_team_short, at.logo as away_team_logo,
                    l.name as league_name, l.logo as league_logo,
                    sc.name as sport_name
             FROM matches m
             JOIN teams ht ON m.home_team_id = ht.id
             JOIN teams at ON m.away_team_id = at.id
             JOIN leagues l ON m.league_id = l.id
             JOIN sport_categories sc ON l.sport_category_id = sc.id
             ${whereClause}
             ORDER BY m.match_date ASC`,
            params
        );
        
        res.json({
            success: true,
            matches
        });
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar jogo específico com odds
router.get('/matches/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        
        // Buscar informações do jogo
        const matches = await query(
            `SELECT m.*, 
                    ht.name as home_team_name, ht.short_name as home_team_short, ht.logo as home_team_logo,
                    at.name as away_team_name, at.short_name as away_team_short, at.logo as away_team_logo,
                    l.name as league_name, l.logo as league_logo,
                    sc.name as sport_name
             FROM matches m
             JOIN teams ht ON m.home_team_id = ht.id
             JOIN teams at ON m.away_team_id = at.id
             JOIN leagues l ON m.league_id = l.id
             JOIN sport_categories sc ON l.sport_category_id = sc.id
             WHERE m.id = ? AND m.is_active = TRUE`,
            [matchId]
        );
        
        if (matches.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Jogo não encontrado'
            });
        }
        
        const match = matches[0];
        
        // Buscar odds disponíveis
        const odds = await query(
            `SELECT o.*, bt.name as bet_type_name, bt.description as bet_type_description
             FROM odds o
             JOIN bet_types bt ON o.bet_type_id = bt.id
             WHERE o.match_id = ? AND o.is_active = TRUE
             ORDER BY bt.name, o.selection`,
            [matchId]
        );
        
        // Agrupar odds por tipo de aposta
        const oddsByType = {};
        odds.forEach(odd => {
            if (!oddsByType[odd.bet_type_name]) {
                oddsByType[odd.bet_type_name] = {
                    id: odd.bet_type_id,
                    name: odd.bet_type_name,
                    description: odd.bet_type_description,
                    selections: []
                };
            }
            oddsByType[odd.bet_type_name].selections.push({
                selection: odd.selection,
                odds: odd.odds_value
            });
        });
        
        res.json({
            success: true,
            match,
            odds: Object.values(oddsByType)
        });
        
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar jogos ao vivo
router.get('/live-matches', async (req, res) => {
    try {
        const liveMatches = await query(
            `SELECT m.*, 
                    ht.name as home_team_name, ht.short_name as home_team_short,
                    at.name as away_team_name, at.short_name as away_team_short,
                    l.name as league_name, sc.name as sport_name
             FROM matches m
             JOIN teams ht ON m.home_team_id = ht.id
             JOIN teams at ON m.away_team_id = at.id
             JOIN leagues l ON m.league_id = l.id
             JOIN sport_categories sc ON l.sport_category_id = sc.id
             WHERE m.status = 'live' AND m.is_active = TRUE
             ORDER BY m.match_date ASC`
        );
        
        res.json({
            success: true,
            live_matches: liveMatches
        });
    } catch (error) {
        console.error('Erro ao buscar jogos ao vivo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar jogos por data
router.get('/matches-by-date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        const matches = await query(
            `SELECT m.*, 
                    ht.name as home_team_name, ht.short_name as home_team_short,
                    at.name as away_team_name, at.short_name as away_team_short,
                    l.name as league_name, sc.name as sport_name
             FROM matches m
             JOIN teams ht ON m.home_team_id = ht.id
             JOIN teams at ON m.away_team_id = at.id
             JOIN leagues l ON m.league_id = l.id
             JOIN sport_categories sc ON l.sport_category_id = sc.id
             WHERE DATE(m.match_date) = ? AND m.is_active = TRUE
             ORDER BY m.match_date ASC`,
            [date]
        );
        
        res.json({
            success: true,
            date,
            matches
        });
    } catch (error) {
        console.error('Erro ao buscar jogos por data:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar times por liga
router.get('/leagues/:leagueId/teams', async (req, res) => {
    try {
        const { leagueId } = req.params;
        
        const teams = await query(
            `SELECT t.*, l.name as league_name
             FROM teams t
             JOIN leagues l ON t.league_id = l.id
             WHERE t.league_id = ?
             ORDER BY t.name`,
            [leagueId]
        );
        
        res.json({
            success: true,
            teams
        });
    } catch (error) {
        console.error('Erro ao buscar times:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar estatísticas de um time
router.get('/teams/:teamId/stats', async (req, res) => {
    try {
        const { teamId } = req.params;
        
        // Estatísticas como time da casa
        const homeStats = await query(
            `SELECT 
                COUNT(*) as total_matches,
                SUM(CASE WHEN m.status = 'finished' THEN 1 ELSE 0 END) as finished_matches,
                SUM(CASE WHEN m.status = 'finished' AND m.home_score > m.away_score THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN m.status = 'finished' AND m.home_score = m.away_score THEN 1 ELSE 0 END) as draws,
                SUM(CASE WHEN m.status = 'finished' AND m.home_score < m.away_score THEN 1 ELSE 0 END) as losses,
                SUM(CASE WHEN m.status = 'finished' THEN m.home_score ELSE 0 END) as goals_for,
                SUM(CASE WHEN m.status = 'finished' THEN m.away_score ELSE 0 END) as goals_against
             FROM matches m
             WHERE m.home_team_id = ? AND m.status = 'finished'`,
            [teamId]
        );
        
        // Estatísticas como time visitante
        const awayStats = await query(
            `SELECT 
                COUNT(*) as total_matches,
                SUM(CASE WHEN m.status = 'finished' THEN 1 ELSE 0 END) as finished_matches,
                SUM(CASE WHEN m.status = 'finished' AND m.away_score > m.home_score THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN m.status = 'finished' AND m.away_score = m.home_score THEN 1 ELSE 0 END) as draws,
                SUM(CASE WHEN m.status = 'finished' AND m.away_score < m.home_score THEN 1 ELSE 0 END) as losses,
                SUM(CASE WHEN m.status = 'finished' THEN m.away_score ELSE 0 END) as goals_for,
                SUM(CASE WHEN m.status = 'finished' THEN m.home_score ELSE 0 END) as goals_against
             FROM matches m
             WHERE m.away_team_id = ? AND m.status = 'finished'`,
            [teamId]
        );
        
        const home = homeStats[0];
        const away = awayStats[0];
        
        const totalMatches = home.total_matches + away.total_matches;
        const totalWins = home.wins + away.wins;
        const totalDraws = home.draws + away.draws;
        const totalLosses = home.losses + away.losses;
        const totalGoalsFor = home.goals_for + away.goals_for;
        const totalGoalsAgainst = home.goals_against + away.goals_against;
        
        const stats = {
            total_matches: totalMatches,
            finished_matches: home.finished_matches + away.finished_matches,
            wins: totalWins,
            draws: totalDraws,
            losses: totalLosses,
            goals_for: totalGoalsFor,
            goals_against: totalGoalsAgainst,
            goal_difference: totalGoalsFor - totalGoalsAgainst,
            win_rate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) : 0
        };
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas do time:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
