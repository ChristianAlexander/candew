export class CanDew<Action = any, Context = any, Target = any> {
  for = (action: Action) => {
    const self = this;

    return {
      useValidator(validator: Validator<Context, Target>) {
        self.validatorsByAction.set(action, validator);
      },
    };
  };

  can = (
    context: Context,
    action: Action,
    target: Target
  ): Promise<boolean> => {
    const validator = this.validatorsByAction.get(action);
    if (!validator) {
      return Promise.resolve(false);
    }

    return Promise.resolve(validator(context, target));
  };

  private validatorsByAction = new Map<Action, Validator<Context, Target>>();
}

export type Validator<Context, Target> = (
  context: Context,
  target: Target
) => Promise<boolean> | boolean;

export function some<Context = any, Target = any>(
  ...validators: Validator<Context, Target>[]
): Validator<Context, Target> {
  return async (context: Context, target: Target) => {
    const results = await Promise.all(
      validators.map((v) => v(context, target))
    );

    return results.some((r) => r);
  };
}

export function all<Context = any, Target = any>(
  ...validators: Validator<Context, Target>[]
): Validator<Context, Target> {
  return async (context: Context, target: Target) => {
    const results = await Promise.all(
      validators.map((v) => v(context, target))
    );

    return results.every((r) => r);
  };
}

export function rejectOnError<Context = any, Target = any>(
  validator: Validator<Context, Target>
) {
  return (context: Context, target: Target) =>
    Promise.resolve(validator(context, target)).catch(() => false);
}
