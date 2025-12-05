/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   snake.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mdourdoi <mdourdoi@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:27:39 by mdourdoi          #+#    #+#             */
/*   Updated: 2025/12/05 01:59:55 by mdourdoi         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

console.log("Snake JS chargé");

const tiles = 30;
const tile_size = 20;
let game_speed_ms = 100;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = tiles * tile_size;
canvas.height = tiles * tile_size;

let is_game_over = false;
let direction = { x : 1, y : 0 };
let pending_directions = [];
let food = { x : 5, y : 5};
let snake = [
	{ x : 10, y : 10 },
	{ x : 9,  y : 10 },
	{ x : 8,  y : 10 }
];
let game_interval = null;

function draw_cell(x, y, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x * tile_size, y * tile_size, tile_size, tile_size);
}

function draw_snake_head(snake_segment)
{
	const cell_x = snake_segment.x * tile_size;
	const cell_y = snake_segment.y * tile_size;
	const x0 = cell_x;
	const y0 = cell_y;
	const x1 = cell_x + tile_size;
	const y1 = cell_y + tile_size;
	const pad = tile_size * 0.25;
	const r = tile_size * 0.20;

	ctx.fillStyle = "#27ae60";
	ctx.beginPath();

	if (direction.x === 1 && direction.y === 0)
	{
		ctx.moveTo(x0, y0);
		ctx.lineTo(x0, y1);
		ctx.lineTo(x1 - r, y1 - pad);
		ctx.arcTo(x1, y1 - pad, x1, y0 + pad, r);
		ctx.arcTo(x1, y0 + pad, x1 - r, y0 + pad, r);
	}
	else if (direction.x === -1 && direction.y === 0)
	{
		ctx.moveTo(x1, y0);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x0 + r, y1 - pad);
		ctx.arcTo(x0, y1 - pad, x0, y0 + pad, r);
		ctx.arcTo(x0, y0 + pad, x0 + r, y0 + pad, r);
	}
	else if (direction.x === 0 && direction.y === -1)
	{
		ctx.moveTo(x0, y1);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x1 - pad, y0 + r);
		ctx.arcTo(x1 - pad, y0, x0 + pad, y0, r);
		ctx.arcTo(x0 + pad, y0, x0 + pad, y0 + r, r);
	}
	else if (direction.x === 0 && direction.y === 1)
	{
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y0);
		ctx.lineTo(x1 - pad, y1 - r);
		ctx.arcTo(x1 - pad, y1, x0 + pad, y1, r);
		ctx.arcTo(x0 + pad, y1, x0 + pad, y1 - r, r);
	}
	else
	{
		draw_cell(snake_segment.x, snake_segment.y, "#27ae60");
		return;
	}

	ctx.closePath();
	ctx.fill();
}

function draw_snake_tail(snake_segment)
{
	const tail_index = snake.length - 1;
	const before_tail = snake[tail_index - 1];
	const body_dx = before_tail.x - snake_segment.x;
	const body_dy = before_tail.y - snake_segment.y;

	const cell_x = snake_segment.x * tile_size;
	const cell_y = snake_segment.y * tile_size;
	const x0 = cell_x;
	const y0 = cell_y;
	const x1 = cell_x + tile_size;
	const y1 = cell_y + tile_size;
	const r = tile_size * 0.5;

	ctx.fillStyle = "#2ecc71";
	ctx.beginPath();

	if (body_dx === 1 && body_dy === 0)
	{
		ctx.moveTo(x1, y0);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x0 + r, y1);
		ctx.arcTo(x0, y1, x0, y0, r);
		ctx.arcTo(x0, y0, x0 + r, y0, r);
	}
	else if (body_dx === -1 && body_dy === 0)
	{
		ctx.moveTo(x0, y0);
		ctx.lineTo(x0, y1);
		ctx.lineTo(x1 - r, y1);
		ctx.arcTo(x1, y1, x1, y0, r);
		ctx.arcTo(x1, y0, x1 - r, y0, r);
	}
	else if (body_dx === 0 && body_dy === 1)
	{
		ctx.moveTo(x0, y1);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x1, y0 + r);
		ctx.arcTo(x1, y0, x0, y0, r);
		ctx.arcTo(x0, y0, x0, y0 + r, r);
	}
	else if (body_dx === 0 && body_dy === -1)
	{
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y0);
		ctx.lineTo(x1, y1 - r);
		ctx.arcTo(x1, y1, x0, y1, r);
		ctx.arcTo(x0, y1, x0, y1 - r, r);
	}
	else
	{
		draw_cell(snake_segment.x, snake_segment.y, "#2ecc71");
		return;
	}

	ctx.closePath();
	ctx.fill();
}

function draw_snake_segment(snake_segment, index)
{
	let color;

	if (index === 0)
		draw_snake_head(snake_segment);
	else if (index === snake.length - 1)
		draw_snake_tail(snake_segment);
	else
		draw_cell(snake_segment.x, snake_segment.y, "#2ecc71");
}

function draw_food(grid_x, grid_y)
{
	const x = grid_x * tile_size;
	const y = grid_y * tile_size;
	const s = tile_size;

	const px = Math.max(1, Math.floor(s / 5));

	ctx.fillStyle = "#5a0000";
	ctx.fillRect(x, y, s, s);

	for (let i = 0; i < s; i += px)
	{
		for (let j = 0; j < s; j += px)
		{
			if ((i + j) % (px * 2) === 0)
				ctx.fillStyle = "#ff3b3b";
			else
				ctx.fillStyle = "#cc2e2e";

			ctx.fillRect(x + i, y + j, px, px);
		}
	}

	const stem_w = px;
	const stem_h = px * 2;
	const stem_x = x + Math.floor((s - stem_w) / 2);
	const stem_y = y - Math.floor(px / 2);

	ctx.fillStyle = "#2f8f2f";
	ctx.fillRect(stem_x, stem_y, stem_w, stem_h);
}

function is_oob(head)
{
	return (head.x < 0 || head.x >= tiles || head.y < 0 || head.y >= tiles);
}

function handle_keydown(event)
{
	if (is_game_over)
		return;

	let candidate_direction = null;

	if (event.key === "ArrowUp")
		candidate_direction = { x : 0, y : -1 };
	else if (event.key === "ArrowDown")
		candidate_direction = { x : 0, y : 1 };
	else if (event.key === "ArrowLeft")
		candidate_direction = { x : -1, y : 0 };
	else if (event.key === "ArrowRight")
		candidate_direction = { x : 1, y : 0 };
	else
		return;

	let last_direction = direction;
	if (pending_directions.length > 0)
		last_direction = pending_directions[pending_directions.length - 1];

	if (candidate_direction.x === -last_direction.x
		&& candidate_direction.y === -last_direction.y)
		return;
		
	if (candidate_direction.x === last_direction.x
		&& candidate_direction.y === last_direction.y)
		return;

	pending_directions.push(candidate_direction);
}

function restart_interval()
{
	if (game_interval !== null)
		clearInterval(game_interval);
	game_interval = setInterval(game_step, game_speed_ms);
}

function end_game()
{
	is_game_over = true;
	if (game_interval !== null)
		clearInterval(game_interval);
	console.log("Game Over");
}

function is_on_snake(x, y)
{
	for (let i = 0; i < snake.length; i++)
	{
		if (snake[i].x === x && snake[i].y === y)
			return (true);
	}
	return (false);
}

function spawn_food()
{
	while (true)
	{
		const rand_x = Math.floor(Math.random() * tiles);
		const rand_y = Math.floor(Math.random() * tiles);

		if (!is_on_snake(rand_x, rand_y))
		{
			food.x = rand_x;
			food.y = rand_y;
			break ;
		}
	}
}

function update_snake()
{
	const head = snake[0];
	
	if (pending_directions.length > 0)
	{
		direction = pending_directions.shift();
	}
	
	const new_head = {
		x : head.x + direction.x,
		y : head.y + direction.y
	};

	if (is_oob(new_head) || is_on_snake(new_head.x, new_head.y))
	{
		end_game();
		return;
	}
	if (new_head.x === food.x && new_head.y === food.y)
	{
		snake.unshift(new_head);
		spawn_food();

		game_speed_ms = Math.max(70, game_speed_ms - 2);
		restart_interval();
	}
	else
	{
		snake.unshift(new_head);
		snake.pop();
	}
}

function draw_border()
{
	const thickness = Math.max(2, Math.floor(tile_size / 8));

	ctx.fillStyle = "#ff0000ff";

	ctx.fillRect(0, 0, canvas.width, thickness);                     
	ctx.fillRect(0, canvas.height - thickness, canvas.width, thickness); 
	ctx.fillRect(0, 0, thickness, canvas.height);                        
	ctx.fillRect(canvas.width - thickness, 0, thickness, canvas.height);
}

function draw_game()
{
	ctx.fillStyle = "#0f0f0f";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	draw_border();
	draw_food(food.x, food.y);
	snake.forEach(draw_snake_segment);
}

function game_step()
{
	if (is_game_over)
		return;
	update_snake();
	draw_game();
}

spawn_food();
draw_game();
game_interval = setInterval(game_step, game_speed_ms);
window.addEventListener("keydown", handle_keydown);
