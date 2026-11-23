/**
 * Short form cues per step, written for this app as a reminder. They are not
 * text from Convict Conditioning; the book has the full instructions.
 * Indexed by movement slug, then step number - 1.
 */
export const FORM_CUES: Record<string, readonly (readonly string[])[]> = {
  pushups: [
    ["Stand facing a wall, hands on it at shoulder height and width.", "Keep a straight line from head to heels.", "Lower until your forehead nearly touches the wall, then press back."],
    ["Hands on a sturdy surface around hip height, body straight and leaning in.", "Lower your chest to the edge, elbows tucked at about 45°.", "Press back to straight arms without letting your hips sag."],
    ["On your knees with hands under your shoulders, hips in line with your torso.", "Lower until your chest is a fist's height from the floor.", "Keep your midsection tight; don't pike your hips."],
    ["Full plank on your toes, body rigid.", "Lower only halfway, to about a 90° elbow angle (a ball under your hips helps gauge depth).", "Press up smoothly; no bouncing at the bottom."],
    ["Plank on your toes, hands under your shoulders.", "Lower until your chest is a fist's height from the floor.", "Press to locked arms; body stays one straight line throughout."],
    ["Full pushup position with hands touching or almost touching.", "Lower with elbows tracking back along your sides.", "Press up under control; keep your shoulders packed."],
    ["One hand on the floor, the other on a ball or low object.", "Most of the work goes through the floor hand.", "Lower to a fist's height, press up; switch sides and match reps."],
    ["One-arm pushup position, feet wide, the free hand behind your back.", "Lower only to about halfway, elbow close to the body.", "Keep hips and shoulders square to the floor."],
    ["One hand under your chest, the other arm straight out to the side on a low object.", "Lower mostly with the bent arm; the straight arm just steadies you.", "Keep the straight arm locked and the body rigid."],
    ["Feet wide, one hand under your chest, the other behind your back.", "Lower until your chest is a fist's height from the floor, without twisting.", "Press up slowly; your hips and shoulders stay level."],
  ],
  squats: [
    ["Lie on your back and roll up onto your shoulders, hands supporting your lower back.", "Bend your knees toward your forehead, then straighten them back up.", "Move slowly; keep your weight on your shoulders, not your neck."],
    ["Hands on a knee-height support in front, legs straight, hips high like an upside-down V.", "Bend your knees and hips until your hamstrings meet your calves, using your arms a little.", "Push up mostly with your legs."],
    ["Hold a sturdy object in front of you, feet shoulder-width.", "Squat all the way down, using your hands only as much as needed.", "Drive up through your heels with your back upright."],
    ["Stand with feet shoulder-width, arms forward for balance.", "Bend to about a 90° knee angle (thighs near parallel).", "Stand back up without bouncing; knees follow your toes."],
    ["Feet shoulder-width, arms forward.", "Lower all the way until your hamstrings touch your calves.", "Stand up with your heels down and chest up."],
    ["Feet together, arms forward for balance.", "Squat all the way down, keeping your knees together.", "Rise without letting your heels lift."],
    ["One foot flat, the other resting on a ball or low object in front.", "Squat down mostly on the flat leg.", "Rise using the flat leg; switch sides and match reps."],
    ["Stand on one leg, the other held straight out in front.", "Squat to about halfway down on the standing leg.", "Keep your balance; stand up without letting the knee cave in."],
    ["Stand on one leg next to a support, the other leg straight out in front.", "Squat all the way down, using one hand on the support (or a ball) as little as possible.", "Rise mainly with the standing leg."],
    ["Stand on one leg, the other straight out in front, arms forward.", "Lower all the way down under full control.", "Rise without help; keep the heel down and knee in line."],
  ],
  pullups: [
    ["Stand facing a doorframe or post, hold it at chest height.", "Lean back with straight arms, then pull your chest toward the post.", "Squeeze your shoulder blades together at the top."],
    ["Lie under a sturdy table or low bar, grip it shoulder-width, heels on the floor.", "Pull your chest up to the bar with your body straight.", "Lower until your arms are straight."],
    ["Bar at about hip height; sit under it with feet on a support in front, legs bent.", "Pull up using your arms, helping only as much as needed with your legs.", "Lower slowly to straight arms."],
    ["Hang from a bar with an overhand, shoulder-width grip.", "Start with elbows at about 90° and pull your chin over the bar.", "Lower back only to the half position; no swinging."],
    ["Dead hang, overhand grip, shoulder-width.", "Pull until your chin clears the bar.", "Lower all the way to straight arms each rep; no kipping."],
    ["Overhand grip with hands touching or nearly touching.", "Pull until your chin clears the bar.", "Lower to straight arms under control."],
    ["One hand on the bar, the other holding a towel hanging from it.", "Pull up mostly with the bar arm; the towel hand helps.", "Lower fully; switch sides and match reps."],
    ["Hang from one arm.", "Pull from straight arm up to about a 90° elbow.", "Keep your body still and shoulders engaged."],
    ["One hand on the bar, the other on a towel lower down.", "Pull up mainly with the bar arm, using the towel hand less over time.", "Lower to a dead hang; switch sides."],
    ["Hang from one arm, the other arm free.", "Pull until your chin clears the bar.", "Lower slowly; avoid twisting or swinging."],
  ],
  "leg-raises": [
    ["Sit on a chair edge, lean back slightly, legs out straight.", "Pull your knees toward your chest.", "Breathe out as the knees come in; extend slowly."],
    ["Lie flat, hands under your hips, knees bent at 90°.", "Bring your knees toward your chest.", "Lower until your heels nearly touch the floor."],
    ["Lie flat, knees bent at about 90°.", "Lift your legs until your thighs are vertical.", "Lower until your heels nearly touch the floor; keep your lower back down."],
    ["Lie flat and start with knees pulled in.", "Straighten your legs as you lower them, and bend them again as they rise.", "Keep the movement controlled; no swinging."],
    ["Lie flat with legs straight and together.", "Raise your legs until they're vertical.", "Lower until your heels nearly touch the floor without arching your back."],
    ["Hang from a bar with straight arms.", "Raise your knees to your hips or higher.", "Lower slowly without swinging."],
    ["Hang from a bar, knees bent at about 90°.", "Raise your knees until your thighs are at least parallel to the floor.", "Lower under control; don't use momentum."],
    ["Hang from a bar with legs straight.", "Bend your knees as you raise them, straighten as you lower.", "Keep your torso still."],
    ["Hang from a bar with legs straight.", "Raise your legs as far as you can with straight knees.", "Lower slowly; aim for higher each session."],
    ["Hang from a bar, legs straight and together.", "Raise your straight legs until they reach the bar or at least hip height.", "Lower under full control; no swinging."],
  ],
  bridges: [
    ["Lie on your back, knees bent, feet flat, arms by your sides.", "Lift your hips until your body is a straight line from shoulders to knees.", "Squeeze your glutes at the top; lower slowly."],
    ["Sit with legs straight and hands on the floor beside your hips.", "Push your hips up until your body is straight from shoulders to feet.", "Lower back to sitting under control."],
    ["Set up with your hands on a sturdy support around knee height behind you, feet flat on the floor.", "Push your hips up into an angled arch.", "Look back toward the support; lower slowly."],
    ["Lie on your back with hands by your head and feet flat.", "Lift your hips and roll onto the top of your head.", "Keep weight on your hands and feet, not your neck."],
    ["Place a ball under your lower back; hands by your head, feet flat.", "Push up into a half arch until your arms and legs straighten.", "Lower back onto the ball under control."],
    ["Lie on your back, hands by your head with fingers pointing toward your feet.", "Push up into a full arch with arms and legs straight.", "Look at your hands; lower slowly."],
    ["Stand about a metre from a wall, facing away.", "Lean back and walk your hands down the wall into a full bridge.", "Walk back up the wall to standing."],
    ["Stand with your back to a wall, start in a full bridge.", "Walk your hands up the wall to stand.", "Move slowly and keep your hips pushed forward."],
    ["Stand with feet shoulder-width, arms overhead.", "Lean back and lower into a full bridge without using a wall.", "Push your hips forward to control the descent."],
    ["Stand with arms overhead.", "Lower into a full bridge, then rise back to standing.", "Drive your hips forward on the way up; move slowly."],
  ],
  "handstand-pushups": [
    ["Kneel facing a wall, head on a folded towel, hands forming a triangle.", "Walk your feet up and kick gently onto the wall.", "Keep most weight on your hands; breathe steadily."],
    ["Squat with hands on the floor, knees resting on your elbows.", "Lean forward until your feet lift off.", "Hold, keeping your head up and arms slightly bent."],
    ["Hands shoulder-width about a hand's length from a wall.", "Kick up into a handstand with your heels on the wall.", "Lock your arms and keep your body tight."],
    ["Handstand against a wall.", "Lower until your head is about halfway to the floor.", "Press back to straight arms; no arching."],
    ["Handstand against a wall, hands shoulder-width.", "Lower until your head lightly touches the floor.", "Press back to straight arms under control."],
    ["Handstand against a wall with hands touching or close together.", "Lower until your head touches the floor.", "Press up with elbows tracking forward."],
    ["Handstand against a wall, one hand on the floor and one on a ball.", "Lower mainly with the floor hand.", "Press up; switch sides and match reps."],
    ["One-arm handstand against a wall, the free hand on your leg.", "Lower to about halfway.", "Press up, keeping your body tight."],
    ["Handstand against a wall, one hand under your shoulder, the other arm out to the side.", "Lower mainly with the bent arm.", "Press up; switch sides."],
    ["One-arm handstand against a wall.", "Lower until your head touches the floor.", "Press up slowly, keeping your balance."],
  ],
};

export function formCues(movementSlug: string, stepNumber: number): readonly string[] {
  return FORM_CUES[movementSlug]?.[stepNumber - 1] ?? [];
}
