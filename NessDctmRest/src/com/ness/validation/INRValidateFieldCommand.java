package com.ness.validation;

import java.util.List;

// Command Pattern interface that activates dynamic function to check field validity
public interface INRValidateFieldCommand
{
	public boolean execute(List<Object> fieldValue);
}
