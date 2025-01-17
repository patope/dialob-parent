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
package io.dialob.groovy;

import io.dialob.rule.parser.function.FunctionRegistry;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration(proxyBeanMethods = false)
public class DialobGroovyFunctionsAutoConfiguration {

  @Bean
  public GroovyFunctionRegistry groovyFunctionRegistry(ApplicationContext applicationContext, FunctionRegistry functionRegistry) {
    GroovyFunctionRegistry groovyFunctionRegistry = new GroovyFunctionRegistry(applicationContext, functionRegistry);
    List<String> functions = new ArrayList<>();
    functions.add("classpath:/scripts/FoaasService.groovy");
    groovyFunctionRegistry.setGroovyFunctions(functions);
    return groovyFunctionRegistry;
  }

}
