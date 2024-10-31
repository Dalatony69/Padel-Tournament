# set NODE_OPTIONS=--openssl-legacy-provider

from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import json
import itertools


app = Flask(__name__)
CORS(app)

db_config = {
    'host': '13.61.73.123',
    'database': 'sparx_schema',
    'user': 'Dalatony_MYSQL',
    'password': 'Elsharkawy(2005)'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=db_config['host'],
            database=db_config['database'],
            user=db_config['user'],
            password=db_config['password']
        )
        if connection.is_connected():
            return connection
        else:
            print("Failed to connect to the database")
            return None
    except Error as e:
        print(f"Error: {e}")
        return None
    
def count_users():
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM user")
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        
        return row[0] if row else 0
    
    except Error as e:
        print(f"Error: {e}")
        return 0
    
def count_teams():
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM team")
        row = cursor.fetchone()
        cursor.close()
        connection.close()
        
        return row[0] if row else 0
    
    except Error as e:
        print(f"Error: {e}")
        return 0

@app.route('/HandleSignUp', methods=['POST'])
def handle_signup():
     data = request.json

     if not data:
        return jsonify({'error': 'No input data provided'}), 400
     print('HandleSign Up CHECK')
     team_id = create_user(data)
     return jsonify({'team_id': team_id}), 200

def create_user(data):

    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        id_1 = count_users() + 1

        sql_1 = "INSERT INTO user (user_id, user_name,user_phone) VALUES (%s, %s,%s)"
        values_1 = (id_1,data['UserName1'],data['UserPhone1'])

        cursor.execute(sql_1, values_1)
        connection.commit()

        id_2 = count_users() + 1
        sql_2 = "INSERT INTO user (user_id, user_name,user_phone) VALUES (%s, %s,%s)"
        values_2 = (id_2,data['UserName2'],data['UserPhone2'])
        cursor.execute(sql_2, values_2)
        connection.commit()

        cursor.close()
        connection.close()
        
        print('Creatingusers CHECK')
        team_id = create_team(id_1,id_2,data['Passcode'])
        return team_id
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to create users'}), 500

@app.route('/HandleRanking', methods=['GET'])
def handle_ranking():
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = connection.cursor()
    groups = ['A', 'B', 'C', 'D']
    
    try:
        for group_id in groups:
            # Fetch all teams in the group along with their points
            sql = "SELECT team_id, team_point FROM team WHERE group_id = %s"
            values = (group_id,)
            cursor.execute(sql, values)
            result = cursor.fetchall()
            
            # Sort the teams by their points in descending order
            sorted_teams = sorted(result, key=lambda x: x[1], reverse=True)
            
            # Update each team's rank in the database based on the sorted order
            for rank, (team_id, team_point) in enumerate(sorted_teams, start=1):
                update_sql = "UPDATE team SET team_rank = %s WHERE team_id = %s"
                cursor.execute(update_sql, (rank, team_id))
        
        connection.commit()
    except Exception as e:
        print(f"Error updating ranks: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()
        return jsonify({'message': 'Ranks updated successfully for all groups'}), 200

def create_team(id_1,id_2,passcode):

    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()

        sql = "UPDATE team SET team_current = 'NO'"
        cursor.execute(sql)
        connection.commit()

        id = count_teams() + 1 
        group_id = check_group('A')
        rank = 1
        sql = "INSERT INTO team (team_id, player1_id, player2_id,group_id,team_current,team_played,team_wins,team_losses,team_gd,team_point,team_rank,team_passcode,team_stage,team_request) VALUES (%s,%s, %s,%s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        values = (id,id_1,id_2, group_id ,'YES',0,0,0,0,0,rank,passcode,'Group-Stage','Waiting')
        
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        
        print('Creatingteam CHECK')
        return id
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to create Team'}), 500
    
@app.route('/ValidateUser', methods=['POST'])
def validate_user():
    data = request.json

    if not data or 'Teamid' not in data or 'Passcode' not in data:
        return jsonify({'error': 'Username and passcode are required'}), 400

    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()

        sql1 = "UPDATE team SET team_current = 'NO'"
        cursor.execute(sql1)
        connection.commit()

        sql2 = "SELECT * FROM team WHERE team_id = %s AND team_passcode = %s"
        values = (data['Teamid'], data['Passcode'])
        
        cursor.execute(sql2, values)
        user = cursor.fetchone()

        if user:
            sql3 = "UPDATE team SET team_current = 'YES' WHERE team_id = %s"
            cursor.execute(sql3,(data['Teamid'],))
            connection.commit()
            return jsonify({'message': 'User validated successfully'}), 200
        else:
            cursor.close()
            connection.close()
            return jsonify({'error': 'Invalid username or passcode'}), 401

    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to validate user'}), 500

@app.route('/AcceptTeam', methods=['POST'])
def accept_team():
    
    try:
        data = request.json

        if not data:
             return jsonify({'error': 'No input data provided'}), 400

        team_id = data['Teamid']
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "UPDATE team SET team_request = %s WHERE team_id = %s"
        values = ('Accepted',team_id)
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Team request accepted successfully'}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Could not find user with current on'}), 500

@app.route('/WhoCurrent', methods=['GET'])
def who_current():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Retrieve player IDs
            sql1 = "SELECT player1_id FROM team WHERE team_current = 'YES'"
            sql2 = "SELECT player2_id FROM team WHERE team_current = 'YES'"

            cursor.execute(sql1)
            id1 = cursor.fetchone()
            cursor.execute(sql2)
            id2 = cursor.fetchone()

        # Extract IDs from tuples, if present
        id1 = id1[0] if id1 else None
        id2 = id2[0] if id2 else None

        # Fetch player names
        user1 = search_player(id1)
        user2 = search_player(id2)

        users = [user1, user2]
        return jsonify(users), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Could not find user with current on'}), 500

def search_player(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "SELECT user_name FROM user WHERE user_id = %s"
        value = (user_id,)
        cursor.execute(sql,value)
        username = cursor.fetchone()
        cursor.close()
        connection.close()
        return username[0] if username else None
    except Error as e:
        print(f"The Holyyyyyyyyyyyyyyyyyy Error: {e}")
        print(user_id)
        return None
    finally:
        cursor.close()
        connection.close()
    
@app.route('/GetData', methods = ['GET'])
def get_data():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "SELECT * FROM team"
        cursor.execute(sql)
        data = cursor.fetchall()

        modified_data = []
        for row in data:
            row_list = list(row)
            username1 = search_player(row_list[1])
            row_list[1] = username1 if username1 else row_list[1]
            username2 = search_player(row_list[2])
            row_list[2] = username2 if username2 else row_list[2]
            modified_data.append(row_list)
        cursor.close()
        connection.close()

        return jsonify(modified_data), 200
    
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'problem with getting players data'}), 500

@app.route('/LobbyData', methods = ['GET'])
def lobby_data():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "SELECT * FROM team WHERE team_request = %s"
        cursor.execute(sql,('Accepted',))
        data = cursor.fetchall()

        modified_data = []
        for row in data:
            row_list = list(row)
            username1 = search_player(row_list[1])
            row_list[1] = username1 if username1 else row_list[1]
            username2 = search_player(row_list[2])
            row_list[2] = username2 if username2 else row_list[2]
            modified_data.append(row_list)
        cursor.close()
        connection.close()

        return jsonify(modified_data), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'problem with getting players data'}), 500
    
@app.route('/WaitingList', methods = ['GET'])
def waiting_list():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "SELECT * FROM team WHERE team_request = %s"
        cursor.execute(sql,('Waiting',))
        data = cursor.fetchall()

        modified_data = []
        for row in data:
            row_list = list(row)
            username1 = search_player(row_list[1])
            row_list[1] = username1 if username1 else row_list[1]
            username2 = search_player(row_list[2])
            row_list[2] = username2 if username2 else row_list[2]
            modified_data.append(row_list)
        cursor.close()
        connection.close()

        return jsonify(modified_data), 200
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'error': 'problem with getting players data'}), 500
    
def check_group(group_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = "SELECT COUNT(*) AS team_count FROM team WHERE group_id = %s"
            cursor.execute(sql, (group_id,))
            rows = cursor.fetchone()
            team_count = rows[0]
            if team_count >= 4:
                current_letter = group_id.lower()
                next_letter = chr(ord(current_letter) + 1).upper()
                return check_group(next_letter)
            else:
                print("Theeeeeeeeeeeee id is " + group_id)
                return group_id
        except Exception as e:
            print(f"Error executing SQL query in check group: {e}")
            return None
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def get_players(team_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = "SELECT player1_id, player2_id FROM team WHERE team_id = %s"
            cursor.execute(sql, (team_id,))
            players = cursor.fetchone()
            if players:
                player1_id, player2_id = players
                # Use search_player to get player names
                player1_name = search_player(player1_id)
                player2_name = search_player(player2_id)
                return [player1_name, player2_name]
            else:
                return [None, None]
        except Exception as e:
            print(f"Error fetching players for team {team_id}: {e}")
            return None
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def get_team(gameid):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = "SELECT game_team1, game_team2 FROM game WHERE game_id = %s"
            cursor.execute(sql, (gameid,))
            Teams = cursor.fetchone()
            if Teams:
                team1_id, team2_id = Teams
                return [team1_id, team2_id]
            else:
                return [None, None]
        except Exception as e:
            return None
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/GetFixtures', methods=['GET'])
def manage_games():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:            
            sql = "SELECT * FROM game"
            cursor.execute(sql)
            games = cursor.fetchall()
            result = []
            for game in games:
                game_id, team1_id, team2_id, game_stage ,game_team1score, game_team2score = game 
                team1_players = get_players(team1_id)
                team2_players = get_players(team2_id)
                result.append({
                    "game_id": game_id,
                    "team1_player1": team1_players[0],
                    "team1_player2": team1_players[1],
                    "team1_score": game_team1score,
                    "team2_player1": team2_players[0],
                    "team2_player2": team2_players[1],
                    "team2_score": game_team2score,
                    "game_stage": game_stage
                })

            return jsonify(result)
        except Exception as e:
            print("8altaaaaaaaaaaaaaaaaaaaaa")
            return "8alta_1"
    except Exception as e:
        print(f"Database connection error: {e}")
        return "8alta 2"
    
@app.route('/CreateFixtures', methods=['GET'])
def create_game():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM game')
        row_count = cursor.fetchone()[0]
        
        if row_count > 0:
            return jsonify({'error': 'Already Done'}), 400

        try:
            groups = ['A', 'B', 'C', 'D']  
            teams_dict = {} 
            for group_id in groups:
                sql = "SELECT team_id FROM team WHERE group_id = %s"
                cursor.execute(sql, (group_id,))
                teams = cursor.fetchall()
                team_ids = [team[0] for team in teams[:4]] 
                teams_dict[group_id] = team_ids

            for group_id, teams in teams_dict.items():
                # Generate all possible pairs of teams within the group
                pairs = list(itertools.combinations(teams, 2))
                
                for team1, team2 in pairs:
                    try:
                        sql = """
                        INSERT INTO game (game_team1, game_team2, game_stage, game_team1score, game_team2score)
                        VALUES (%s, %s, %s, %s, %s)
                        """
                        game_stage = f'Group {group_id}'
                        cursor.execute(sql, (team1, team2, game_stage, 0, 0))
                    except Exception as e:
                        print(f"Error inserting game ({team1} vs {team2}): {e}")
            
            connection.commit()  # Commit the transaction after all inserts
            print("Games created successfully.")
            return "KOLO FOOL"
            
        except Exception as e:
            print("Error in create_game function:", e)
            return None
        
    except Exception as e:
        print(f"Database connection error: {e}")
        return None
    finally:
        cursor.close()
        connection.close()

@app.route('/SetGameScore', methods=['POST'])
def set_gamescore():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Convert scores to integers
        try:
            team1_score = int(data['Team1score'])
            team2_score = int(data['Team2score'])
        except ValueError:
            return jsonify({'error': 'Invalid score format'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Update the game scores
            sql = 'UPDATE game SET game_team1score = %s, game_team2score = %s WHERE game_id = %s'
            values = (team1_score, team2_score, data['Gameid'])
            cursor.execute(sql, values)
            connection.commit()

            # Get the team IDs
            team_ids = get_team(data['Gameid'])
            if team_ids:
                team1_id, team2_id = team_ids

                if team1_score > team2_score:
                    # Team 1 wins
                    winner_id = team1_id
                    loser_id = team2_id
                    winner_gd = team1_score - team2_score
                    loser_gd = team2_score - team1_score
                elif team1_score < team2_score:
                    # Team 2 wins
                    winner_id = team2_id
                    loser_id = team1_id
                    winner_gd = team2_score - team1_score
                    loser_gd = team1_score - team2_score
                else:
                    # Tie
                    return jsonify({'message': 'The game ended in a tie', 'team_ids': team_ids}), 200

                # Update winner's record
                sql = 'UPDATE team SET team_point = team_point + 3, team_played = team_played + 1, team_wins = team_wins + 1, team_gd = team_gd + %s WHERE team_id = %s'
                values = (winner_gd, winner_id)
                cursor.execute(sql, values)

                # Update loser's record
                sql = 'UPDATE team SET team_played = team_played + 1, team_losses = team_losses + 1, team_gd = team_gd - %s WHERE team_id = %s'
                values = (loser_gd, loser_id)
                cursor.execute(sql, values)

                connection.commit()
                print(f"Winner ID: {winner_id}, Loser ID: {loser_id}")
            else:
                print("No teams found for the given game ID")

            return jsonify({'message': 'Game score updated successfully', 'team_ids': team_ids}), 200
        except Exception as e:
            print(f"Query execution error: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed to update game score'}), 500
        finally:
            cursor.close()
            connection.close()
            handle_ranking()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

def manage_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_qualifiers_result = get_qualifiers()

        if 'error' in get_qualifiers_result:
            return get_qualifiers_result
        
        try:
            sql = 'SELECT team_id FROM team WHERE team_stage = %s AND group_id = %s AND team_rank = %s'
            values_list = [
                ('Quarter-Final', 'A', 1),
                ('Quarter-Final', 'A', 2),
                ('Quarter-Final', 'B', 1),
                ('Quarter-Final', 'B', 2),
                ('Quarter-Final', 'C', 1),
                ('Quarter-Final', 'C', 2),
                ('Quarter-Final', 'D', 1),
                ('Quarter-Final', 'D', 2)
            ]
            
            results = {}
            for values in values_list:
                cursor.execute(sql, values)
                result = cursor.fetchone()
                if result:
                    results[f"{values[1]}{values[2]}"] = result[0]
                else:
                    print(f"No team found for {values}")
            
            connection.commit()
            print(f"manage_qualifiers results: {results}")
            return results
        except Exception as e:
            print(f"FAILURE IN MANAGE_QUALIFIERS: {e}")
            connection.rollback()
            return {'error': 'Failed to manage qualifiers'}
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        print(f"Database connection error in MANAGE_QUALIFIERS: {e}")
        return {'error': 'Database connection failed'}

def get_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = 'UPDATE team SET team_stage = %s WHERE team_rank IN (1, 2)'
            values = ('Quarter-Final',)
            cursor.execute(sql, values)
            connection.commit()
            return jsonify({'message': 'Success'}), 200
        except Exception as e:
            print(f"Failure in GET_QUALIFIERS: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed Qualify'}), 500
    except Exception as e:
            print(f"Query execution error: {e}")
            connection.rollback()
            return jsonify({'Database connection failed'}), 500

def set_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

         # Check the total number of rows in the `game` table
        cursor.execute('SELECT COUNT(*) FROM game')
        row_count = cursor.fetchone()[0]
        
        if row_count > 24:
            return jsonify({'error': 'Maximum number of games reached. Qualifiers not set.'}), 400

        data = manage_qualifiers()
        if 'error' in data:
            return jsonify(data), 500
        
        try:
            print(f"set_qualifiers data: {data}")
            sql = 'INSERT INTO game(game_team1, game_team2, game_stage) VALUES (%s, %s, %s)'
            values1 = (data['A1'], data['D2'], 'Quarter-Final')
            values2 = (data['B1'], data['C2'], 'Quarter-Final')
            values3 = (data['C1'], data['B2'], 'Quarter-Final')
            values4 = (data['D1'], data['A2'], 'Quarter-Final')
            cursor.execute(sql, values1)
            cursor.execute(sql, values2)
            cursor.execute(sql, values3)
            cursor.execute(sql, values4)
            connection.commit()
            return jsonify({'message': 'Qualifiers set successfully'}), 200
        except Exception as e:
            print(f"Failure in SET_QUALIFIERS: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed to set qualifiers'}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        print(f"Database connection error in SET_QUALIFIERS: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/ShowQualifiers', methods=['GET'])    
def show_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        set_qualifiers()

        sqll = 'UPDATE setting set setting_quarterfinal = %s'
        cursor.execute(sqll, ('Show',))
        connection.commit()

        try:            
            sql = "SELECT * FROM game WHERE game_stage = %s"
            cursor.execute(sql,('Quarter-Final',))
            games = cursor.fetchall()
            result = []
            for game in games:
                game_id, team1_id, team2_id, game_stage ,game_team1score, game_team2score = game 
                team1_players = get_players(team1_id)
                team2_players = get_players(team2_id)
                result.append({
                    "game_id": game_id,
                    "team1_player1": team1_players[0],
                    "team1_player2": team1_players[1],
                    "team1_score": game_team1score,
                    "team2_player1": team2_players[0],
                    "team2_player2": team2_players[1],
                    "team2_score": game_team2score,
                    "game_stage": game_stage
                })

            return jsonify(result), 200
        except Exception as e:
            print("Failure in Show_QUALIFIERS")
            return jsonify({'error': 'An error occurred while fetching the qualifiers'}), 500
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/QualifySemi', methods=['POST'])  
def qualify_semi():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Convert scores to integers
        try:
            team1_score = int(data['Team1score'])
            team2_score = int(data['Team2score'])
            game_id = int(data['game_id'])
        except ValueError:
            return jsonify({'error': 'Invalid score format'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Update the game scores
            sql = 'UPDATE game SET game_team1score = %s, game_team2score = %s WHERE game_id = %s'
            values = (team1_score, team2_score, game_id)
            cursor.execute(sql, values)
            connection.commit()
            
            # Get the team IDs
            team_ids = get_team(game_id)
            if team_ids:
                team1_id, team2_id = team_ids

                if team1_score > team2_score:
                    # Team 1 wins
                    winner_id = team1_id
                    loser_id = team2_id
                elif team1_score < team2_score:
                    # Team 2 wins
                    winner_id = team2_id
                    loser_id = team1_id
                else:
                    # Tie
                    return jsonify({'message': 'The game ended in a tie', 'team_ids': team_ids}), 200
            
                # Update winner's record
                if game_id == 25 or game_id == 26:
                    sql = 'UPDATE team SET team_stage = %s WHERE team_id = %s'
                    values = ('LSemi-Final', winner_id)
                    cursor.execute(sql, values)
                else:
                    sql = 'UPDATE team SET team_stage = %s WHERE team_id = %s'
                    values = ('RSemi-Final', winner_id)
                    cursor.execute(sql, values)


                connection.commit()
                print(f"Winner ID: {winner_id}, Loser ID: {loser_id}")
            else:
                print("No teams found for the given game ID")

            return jsonify({'message': 'Game score updated successfully', 'team_ids': team_ids}), 200
        except Exception as e:
            print(f"Query execution error: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed to update game score'}), 500
        finally:
            cursor.close()
            connection.close()
            handle_ranking()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

def set_semi():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Query for the left semi-final teams
            sql = "SELECT * FROM team WHERE team_stage = %s"
            cursor.execute(sql, ('LSemi-Final',))
            left_teams = cursor.fetchall()

            # Query for the right semi-final teams
            cursor.execute(sql, ('RSemi-Final',))
            right_teams = cursor.fetchall()

            if len(left_teams) != 2 or len(right_teams) != 2:
                return jsonify({'error': 'Incorrect number of teams for semi-finals'}), 400

            cursor.execute('SELECT COUNT(*) FROM game')
            row_count = cursor.fetchone()[0]
        
            if row_count > 28:
                return jsonify({'error': 'Maximum number of games reached. Qualifiers not set.'}), 400

            
            # Insert semi-final games
            sql1 = 'INSERT INTO game(game_team1, game_team2, game_stage) VALUES (%s, %s, %s)'
            values1 = (left_teams[0][0], left_teams[1][0], 'LSemi-Final')
            values2 = (right_teams[0][0], right_teams[1][0], 'RSemi-Final')
            cursor.execute(sql1, values1)
            cursor.execute(sql1, values2)
            connection.commit()

            return jsonify({'message': 'Semi-finals set successfully'}), 200
        except Exception as e:
            print(f"Failure in set_semi: {e}")
            connection.rollback()
            return jsonify({'error': 'An error occurred while setting the semi-finals'}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/ShowSemiQualifiers', methods=['GET']) 
def show_semi_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        set_semi()

        sqll = 'UPDATE setting set setting_semifinal = %s'
        cursor.execute(sqll, ('Show',))
        connection.commit()

        try:
            # Fetch the semi-final games
            sql = "SELECT * FROM game WHERE game_stage = %s"
            cursor.execute(sql, ('LSemi-Final',))
            left_game = cursor.fetchone()

            cursor.execute(sql, ('RSemi-Final',))
            right_game = cursor.fetchone()

            # Check if both games are found
            if not left_game or not right_game:
                return jsonify({'error': 'Semi-final games not found'}), 404

            # Extract game details
            left_game_id, left_team1_id, left_team2_id, left_game_stage, left_team1_score, left_team2_score = left_game
            right_game_id, right_team1_id, right_team2_id, right_game_stage, right_team1_score, right_team2_score = right_game

            # Fetch player details for both games
            left_team1_players = get_players(left_team1_id)
            left_team2_players = get_players(left_team2_id)
            right_team1_players = get_players(right_team1_id)
            right_team2_players = get_players(right_team2_id)

            # Construct the result
            result = [
                {
                    "game_id": left_game_id,
                    "team1_player1": left_team1_players[0],
                    "team1_player2": left_team1_players[1],
                    "team1_score": left_team1_score,
                    "team2_player1": left_team2_players[0],
                    "team2_player2": left_team2_players[1],
                    "team2_score": left_team2_score,
                    "game_stage": left_game_stage
                },
                {
                    "game_id": right_game_id,
                    "team1_player1": right_team1_players[0],
                    "team1_player2": right_team1_players[1],
                    "team1_score": right_team1_score,
                    "team2_player1": right_team2_players[0],
                    "team2_player2": right_team2_players[1],
                    "team2_score": right_team2_score,
                    "game_stage": right_game_stage
                }
            ]
            return jsonify(result), 200

        except Exception as e:
            print(f"Failure in show_semi_qualifiers: {e}")
            return jsonify({'error': 'An error occurred while fetching the semi-final qualifiers'}), 500
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/QualifyFinal', methods=['POST'])  
def qualify_final():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Convert scores to integers
        try:
            team1_score = int(data['Team1score'])
            team2_score = int(data['Team2score'])
            game_id = int(data['game_id'])
        except ValueError:
            return jsonify({'error': 'Invalid score format'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Update the game scores
            sql = 'UPDATE game SET game_team1score = %s, game_team2score = %s WHERE game_id = %s'
            values = (team1_score, team2_score, game_id)
            cursor.execute(sql, values)
            connection.commit()
            
            # Get the team IDs
            team_ids = get_team(game_id)
            if team_ids:
                team1_id, team2_id = team_ids

                if team1_score > team2_score:
                    # Team 1 wins
                    winner_id = team1_id
                    loser_id = team2_id
                elif team1_score < team2_score:
                    # Team 2 wins
                    winner_id = team2_id
                    loser_id = team1_id
                else:
                    # Tie
                    return jsonify({'message': 'The game ended in a tie', 'team_ids': team_ids}), 200
            
                # Update winner's record
                if game_id == 25 or game_id == 26:
                    sql = 'UPDATE team SET team_stage = %s WHERE team_id = %s'
                    values = ('Final', winner_id)
                    cursor.execute(sql, values)
                else:
                    sql = 'UPDATE team SET team_stage = %s WHERE team_id = %s'
                    values = ('Final', winner_id)
                    cursor.execute(sql, values)


                connection.commit()
                print(f"Winner ID: {winner_id}, Loser ID: {loser_id}")
            else:
                print("No teams found for the given game ID")

            return jsonify({'message': 'Game score updated successfully', 'team_ids': team_ids}), 200
        except Exception as e:
            print(f"Query execution error: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed to update game score'}), 500
        finally:
            cursor.close()
            connection.close()
            handle_ranking()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

def set_Final():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Query for the left final teams
            sql = "SELECT * FROM team WHERE team_stage = %s"
            cursor.execute(sql, ('Final',))
            left_teams = cursor.fetchall()

            cursor.execute('SELECT COUNT(*) FROM game')
            row_count = cursor.fetchone()[0]
        
            if row_count > 30:
                return jsonify({'error': 'Maximum number of games reached. Qualifiers not set.'}), 400

            # Insert semi-final games
            sql1 = 'INSERT INTO game(game_team1, game_team2, game_stage) VALUES (%s, %s, %s)'
            values1 = (left_teams[0][0], left_teams[1][0], 'Final')
            cursor.execute(sql1, values1)
            connection.commit()

            return jsonify({'message': 'Semi-finals set successfully'}), 200
        except Exception as e:
            print(f"Failure in set_semi: {e}")
            connection.rollback()
            return jsonify({'error': 'An error occurred while setting the semi-finals'}), 500
        finally:
            cursor.close()
            connection.close()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/ShowFinalQualifiers', methods=['GET']) 
def show_final_qualifiers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        set_Final()

        sqll = 'UPDATE setting set setting_final = %s'
        cursor.execute(sqll, ('Show',))
        connection.commit()

        try:
            # Fetch the final games
            sql = "SELECT * FROM game WHERE game_stage = %s"
            cursor.execute(sql, ('Final',))
            final_game = cursor.fetchone()

            # Extract game details
            game_id, team1_id, team2_id, game_stage, team1_score, team2_score = final_game

            # Fetch player details for both games
            team1_players = get_players(team1_id)
            team2_players = get_players(team2_id)

            # Construct the result
            result = [
                {
                    "game_id": game_id,
                    "team1_player1": team1_players[0],
                    "team1_player2": team1_players[1],
                    "team1_score": team1_score,
                    "team2_player1": team2_players[0],
                    "team2_player2": team2_players[1],
                    "team2_score": team2_score,
                    "game_stage": game_stage
                }
            ]
            return jsonify(result), 200

        except Exception as e:
            print(f"Failure in show_Final_qualifiers: {e}")
            return jsonify({'error': 'An error occurred while fetching the semi-final qualifiers'}), 500
        finally:
            cursor.close()
            connection.close()

    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/WhereTo', methods=['GET']) 
def WhereTo():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = 'SELECT setting_stage From setting '
            cursor.execute(sql)
            setting_stage = cursor.fetchone()
            if setting_stage == 'Lobby':
                return jsonify({'message': 'Lobby'}), 200
            else:
                return jsonify({'message': 'game'}), 200
        except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching '}), 500
    except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching'}), 500

@app.route('/CheckSettingQuarter', methods=['GET']) 
def check_setting_quarter():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = 'SELECT setting_quarterfinal From setting '
            cursor.execute(sql)
            setting_stage = cursor.fetchone()
            setting_value = setting_stage[0]
            if setting_value == 'Show':
                return jsonify({'message': 'Yes'}), 200
            else:
                return jsonify({'message': 'No'}), 200
        except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching '}), 500
    except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching'}), 500

@app.route('/CheckSettingSemi', methods=['GET']) 
def check_setting_semi():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = 'SELECT setting_semifinal From setting '
            cursor.execute(sql)
            setting_stage = cursor.fetchone()
            setting_value = setting_stage[0]
            if setting_value == 'Show':
                return jsonify({'message': 'Yes'}), 200
            else:
                return jsonify({'message': 'No'}), 200
        except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching '}), 500
    except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching'}), 500

@app.route('/CheckSettingFinal', methods=['GET']) 
def check_setting_final():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = 'SELECT setting_final From setting '
            cursor.execute(sql)
            setting_stage = cursor.fetchone()
            setting_value = setting_stage[0]
            if setting_value == 'Show':
                return jsonify({'message': 'Yes'}), 200
            else:
                return jsonify({'message': 'No'}), 200
        except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching '}), 500
    except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching'}), 500

@app.route('/Winner', methods=['POST'])  
def Winnner():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Convert scores to integers
        try:
            team1_score = int(data['Team1score'])
            team2_score = int(data['Team2score'])
            game_id = int(data['game_id'])
        except ValueError:
            return jsonify({'error': 'Invalid score format'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            # Update the game scores
            sql = 'UPDATE game SET game_team1score = %s, game_team2score = %s WHERE game_id = %s'
            values = (team1_score, team2_score, game_id)
            cursor.execute(sql, values)
            connection.commit()
            
            # Get the team IDs
            team_ids = get_team(game_id)
            if team_ids:
                team1_id, team2_id = team_ids

                if team1_score > team2_score:
                    # Team 1 wins
                    winner_id = team1_id
                    loser_id = team2_id
                elif team1_score < team2_score:
                    # Team 2 wins
                    winner_id = team2_id
                    loser_id = team1_id
                else:
                    # Tie
                    return jsonify({'message': 'The game ended in a tie', 'team_ids': team_ids}), 200
            
                # Update winner's record
                sql = 'UPDATE team SET team_stage = %s WHERE team_id = %s'
                values = ('Winner', winner_id)
                cursor.execute(sql, values)
                
                connection.commit()
                print(f"Winner ID: {winner_id}, Loser ID: {loser_id}")
            else:
                print("No teams found for the given game ID")

            return jsonify({'message': 'Game score updated successfully', 'team_ids': team_ids}), 200
        except Exception as e:
            print(f"Query execution error: {e}")
            connection.rollback()
            return jsonify({'error': 'Failed to update game score'}), 500
        finally:
            cursor.close()
            connection.close()
            handle_ranking()
    except Exception as e:
        print(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection failed'}), 500

@app.route('/Terminate',methods =['Get'])
def terminate():
     try:
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            sql = """TRUNCATE TABLE user;
                    TRUNCATE TABLE team;
                    TRUNCATE TABLE groop;
                    TRUNCATE TABLE game;
                    TRUNCATE TABLE setting;
                    """
            cursor.execute(sql)
            result = cursor.fetchone()
            if result:
                return jsonify({'message': 'All Deleted Successfully'}), 200
            else:
                return jsonify({'message': 'Problem wiht Deletion'}), 200
        except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching '}), 500
     except Exception as e:
            print(f"Failure: {e}")
            return jsonify({'error': 'An error occurred while fetching'}), 500
        

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0' , port=5000)