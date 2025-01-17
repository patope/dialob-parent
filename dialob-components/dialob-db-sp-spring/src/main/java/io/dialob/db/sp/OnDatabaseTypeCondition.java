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
package io.dialob.db.sp;

import io.dialob.settings.DialobSettings;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.condition.SpringBootCondition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Slf4j
public class OnDatabaseTypeCondition extends SpringBootCondition {

  @Override
  public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
    Map<String, Object> allAnnotationAttributes =
      metadata.getAnnotationAttributes(ConditionalOnDatabaseType.class.getName(), false);
    DialobSettings.DatabaseType databaseType = (DialobSettings.DatabaseType) allAnnotationAttributes.get("value");
    if (databaseType == null) {
      return ConditionOutcome.noMatch("database type not defined");
    }
    Set<DialobSettings.DatabaseType> requiredTypes = new HashSet<>();
    addType(context, requiredTypes, "dialob.db.database-type");
    addType(context, requiredTypes, "dialob.formDatabase.database-type");
    addType(context, requiredTypes, "dialob.questionnaireDatabase.database-type");

    if (requiredTypes.contains(databaseType)) {
      return ConditionOutcome.match();
    }
    return ConditionOutcome.noMatch("database type " + databaseType + " not required");
  }

  public void addType(ConditionContext context, Set<DialobSettings.DatabaseType> requiredTypes, String key) {
    String databaseTypeProperty = null;
    try {
      databaseTypeProperty = context.getEnvironment().getProperty(key);
      if (databaseTypeProperty != null) {
        requiredTypes.add(DialobSettings.DatabaseType.valueOf(databaseTypeProperty.trim().toUpperCase()));
      }
    } catch (IllegalArgumentException e) {
      LOGGER.error("Unknown database type " + key + "=" + databaseTypeProperty +
        ". Acceptable values are: " + StringUtils.join(DialobSettings.DatabaseType.values(),","));
    }
  }
}
