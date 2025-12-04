/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   snake.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mdourdoi <mdourdoi@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 21:27:39 by mdourdoi          #+#    #+#             */
/*   Updated: 2025/12/04 22:48:54 by mdourdoi         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

console.log("Snake JS chargé");

const tiles = 40;
const tile_size = 20;
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const game_speed_ms = 120;
let direction = {x : 1, y : 0};
let snake = [
	{x : 10, y : 10}
];

canvas.width = tiles * tile_size;
canvas.height = tiles * tile_size;

function draw_cell(x, y, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x * tile_size, y * tile_size, tile_size, tile_size);
}

function handle_keydown(event)
{
	if (event.key === "ArrowUp" && direction.y !== 1)
		direction = {x : 0, y : -1};
	else if (event.key === "ArrowDown" && direction.y !== -1)
		direction = {x : 0, y : 1};
	else if (event.key === "ArrowLeft" && direction.x !== 1)
		direction = {x : -1, y : 0};
	else if (event.key === "ArrowRight" && direction.x !== -1)
		direction = {x : 1, y : 0};
}

function draw_snake_segment(snake_segment, index)
{
	let color;

	if (index === 0)
		color = "#27ae60";
	else
		color = "#2ecc71";
	draw_cell(snake_segment.x, snake_segment.y, color);
}

function update_snake()
{
	const head = snake[0];
	const new_head = {x : head.x + direction.x, y : head.y + direction.y}
	
	snake.unshift(new_head);
	snake.pop();
}

function draw_game()
{
	ctx.fillStyle = "#111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	snake.forEach(draw_snake_segment);
}

draw_game();

function game_step()
{
	update_snake();
	draw_game();
}

window.addEventListener("keydown", handle_keydown);
setInterval(game_step, game_speed_ms);