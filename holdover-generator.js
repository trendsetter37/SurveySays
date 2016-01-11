answer['model'] = "Answer";
answer.data['id'] = i;
answer.data['picked'] = pickedValues[Math.floor(Math.random() * pickedValues.length)];
answer.data['choice'] = randomAnswers.pop();
if (i % 4 === 0) {

  answer.data['question'] = count;
  count++;
} else {
  answer.data['question'] = count;
}

answers.push(answer);
