/*
 * Copyright © 2015 - 2021 ReSys (info@dialob.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.dialob.session.engine.program.expr.arith;

import io.dialob.rule.parser.api.ValueType;
import io.dialob.session.engine.program.EvalContext;
import io.dialob.session.engine.program.model.Expression;
import io.dialob.session.engine.session.command.EventMatcher;
import io.dialob.session.engine.session.model.ValueSetId;
import io.dialob.session.engine.session.model.ValueSetState;
import org.immutables.value.Value;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Optional;
import java.util.Set;

@Value.Immutable
public interface ValueSetEntryToStringOperator extends Expression {

  @Value.Parameter
  ValueSetId getValueSetId();

  @Value.Parameter
  Expression getExpression();

  @Override
  @Nullable
  default String eval(@Nonnull EvalContext context) {
    Object eval = getExpression().eval(context);
    if (eval == null) {
      return null;
    }
    Optional<ValueSetState> valueSetState = context.getValueSetState(getValueSetId());
    return valueSetState.map(valueSetState1 -> {
      for (ValueSetState.Entry entry : valueSetState1.getEntries()) {
        if (entry.getId().equals(eval)) {
          return entry.getLabel();
        }
      }
      return null;
    }).orElse(null);
  }

  @Override
  @Nonnull
  default ValueType getValueType() {
    return ValueType.STRING;
  }

  @Override
  @Nonnull
  default Set<EventMatcher> getEvalRequiredConditions() {
    return getExpression().getEvalRequiredConditions();
  }
}
